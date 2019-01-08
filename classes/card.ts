import {
    Types,
    ZONES,
    XXX_ZONE,
    CARD_TYPES,
    CardDefinition,
    Cards,
    XXX_CARD, // todo: rethink this ..
    TAGS,
    PLAYERCLASS,
    EVENTS,
    EventBus
} from '../data/constants';

let entity_id = 1;

/* tslint:disable:max-classes-per-file */

class Entity implements Cards.Entity {
    entity_id: number;
    eventBus: EventBus;

    id: string;
    type: Types.CardsAllCAPS;
    zone: Types.ZonesAllCAPS = ZONES.aside;

    name: string;

    constructor(cardDef: CardDefinition, eventBus: EventBus) {
        this.entity_id = entity_id++; // can this oveflow ?

        if (!eventBus) throw new RangeError('EventBus required');
        this.eventBus = eventBus;

        if (!cardDef || typeof cardDef !== 'object') throw new TypeError('Object expected');

        this.id = cardDef.id;
        this.type = cardDef.type;
        this.name = cardDef.name;
    }
    toString() {
        return `[${this.type}: ${this.name} #${this.entity_id}]`;
    }
}

class Card extends Entity implements Cards.Card {
    // dbfId: number;
    type: Exclude<Types.CardsAllCAPS, typeof CARD_TYPES.game | typeof CARD_TYPES.player>;
    name: string;
    text: string;
    // targetingArrowText: string;

    // todo: check deathknight cards ? maybe different Player/Card class
    playerClass?: string; // .cardClass seems to be missing on some cards
    // .multiclass ?
    rarity?: string;

    costBase?: number;
    overload?: number;

    play: any;
    target?: string;
    buffs: any[];
    incomingAuras: any[];
    _listener: any = null;

    owner: Player | any; // TODO: refactor Entity hirerarchy, so Player and Game do not inherit Card

    constructor(cardDef: CardDefinition, owner: Player|undefined, eventBus: EventBus) {
        super(cardDef, eventBus);

        if (!cardDef || typeof cardDef !== 'object') throw new TypeError('Object expected');
        if (!owner && !(
                cardDef.type === CARD_TYPES.game ||
                cardDef.type === CARD_TYPES.player
            )
        ) throw new RangeError('Owner player required');

        this.owner = owner;


        this.id = cardDef.id;
        //this.dbfId = cardDef.dbfId;
        this.text = cardDef.text;
        //this.targetingArrowText = cardDef.targetingArrowText;

        this.playerClass = cardDef.playerClass; // .cardClass seems to be missing on some cards
        //.multiclass
        this.rarity = cardDef.rarity;

        this.costBase = cardDef.cost;
        this.overload = cardDef.overload;

        this.play = cardDef.play;
        this.target = cardDef.target;
        //this.chooseOne = ???
        //this.joust = ???

        this.buffs = (cardDef.tags || []).slice(0);
        this.incomingAuras = [];
        //this.tags is a getter

        if (cardDef.death) {
            this.buffs.push({//potentially shuld be .concat, as potentially card can have multiple deathrattles, even initially
                death: cardDef.death
            });
        }
        if (cardDef._trigger_v1) {
            this.buffs.push({ //potentially shuld be .concat, as potentially card can have multiple triggers
                trigger: cardDef._trigger_v1
            });
        }
        if (cardDef.aura) {
            this.buffs.push({//potentially shuld be .concat, as potentially card can have multiple auras
                aura: cardDef.aura
            });
        }
    }
    /** @deprecated compatibility hack */
    get card_id () {
        return this.entity_id;
    }
    get cost() {
        return getter_of_buffed_atribute.call(this, 'cost', this.costBase);
    }

    get tags() {
        //console.log(`card.tags: #${this.card_id}`);
        const allBuffs = this.buffs.concat(this.incomingAuras);
        if (!allBuffs.length) return [];

        let ignoreOlder = allBuffs.lastIndexOf(TAGS.silence);
        if (ignoreOlder === -1) ignoreOlder = 0;
        const activeBuffs = allBuffs.slice(ignoreOlder).map(buffOrTag => {
            //todo: its unclear how to make DoA-like buff work (both stat modifier and tag in same buff)

            if (typeof buffOrTag === 'object') {
                //   return (buffOrTag.tags || []).concat([
                //       {effects: buffOrTag.effects},
                //       {death: buffOrTag.death},
                //       {aura: buffOrTag.aura},
                //       //buffOrTag.trigger // is ignored, because EventEmitter.subscribe is called in playCard.js :(
                //   ].filter(v => v));
            }
            return buffOrTag;
        });

        //console.log(`card.tags returned: ${activeBuffs}`);
        return ([] as any[]).concat.apply([], activeBuffs);
    }
}

class Character extends Card {
    health: number = 0;

    // herecy !
    healthBase: number;
    healthMax: number;
    attackBase: number;
    attackedThisTurn: number;

    constructor(cardDef: CardDefinition, owner: Player, eventBus: EventBus) {
        super(cardDef, owner, eventBus);

        this.attackBase = cardDef.attack || 0;
        //this.attack = this.attackBase;

        this.healthBase = cardDef.health || 0;
        this.health = this.healthBase;
        this.healthMax = this.healthBase; // in the beginning, all characters are at full health

        this.attackedThisTurn = 0; //applies to: Minion, Hero, Power
    }
    get attack() {
        return getter_of_buffed_atribute.call(this, 'attack', this.attackBase);
    }
    _damageApply(n: number, type = '') {
        if (!Number.isInteger) throw new RangeError(`Damage must be integer number, instead got ${n}`);
        const was = this.health;

        if (n > 0 && this.tags.includes(TAGS.divineShield)) {
            this.buffs = this.buffs.filter(v => v !== TAGS.divineShield); // = "removeTag"
            console.log(`(!) ${this.name} loses ${TAGS.divineShield} !`);
        } else {
            this.health -= n;
        }
        const received_damage = was - this.health;
        if (received_damage > 0) {
            console.log(`${type && '🔥 '}${this.name} takes ${received_damage} ${type} damage!`);

            this.eventBus.emit(EVENTS.character_damaged, {
                target: this,
                amount: received_damage
            });
        }

        return this; // or return received_damage; ?
    }
    // public API
    dealDamage(n: number) {
        this._damageApply(n);
        //console.log(`🔥 ${this.name} takes ${was - this.health} damage!`);
    }
    dealDamageSpell(n: number) {
        this._damageApply(n, 'spell');
        //console.log(`🔥 ${this.name} takes ${was - this.health} spell damage!`);
    }
    destroy() {
        this.buffs.push(TAGS._pendingDestruction);
        //console.log(`🔥 ${this.name} was marked for destroy!`);
    }
    silence() {
        console.log(`${this.owner.name}'s ${this} got SILENCED!`);
        this.buffs.push(TAGS.silence);

        // super dirty solution for silencing triggers (copy paste from game.js deathsweep)
        if (this._listener) {
            this.eventBus.removeListener(this._listener[0], this._listener[1]);
            delete this._listener;
        }
    }
    isDamaged() {
        return this.health < this.healthMax;
    }
    isAlive() { // replace with death sweep in game
        return this.health > 0 && !this.tags.includes(TAGS._pendingDestruction);
    }
}

class Minion extends Character {
    race?: string;
    isReady: boolean; // TODO: this is our own extension

    constructor(cardDef: CardDefinition, owner: Player, eventBus: EventBus) {
        super(cardDef, owner, eventBus);

        if (this.type !== CARD_TYPES.minion) throw new RangeError(
            `Card definition has type: ${this.type}, expected: ${CARD_TYPES.minion}`);

        this.race = cardDef.race; // or undefined

        this.isReady = false; //applies only to minion - initial ZZZ / sleep
    }
}
class Spell extends Card {
    constructor(cardDef: CardDefinition, owner: Player, eventBus: EventBus) {
        super(cardDef, owner, eventBus);

        if (this.type !== CARD_TYPES.spell) throw new RangeError(
            `Card definition has type: ${this.type}, expected: ${CARD_TYPES.spell}`);

        //this.secret = cardDef.secret; //must be a function
        //this.quest = cardDef.quest; //must be a function
    }
}
class Weapon extends Card {
    attack: number = 0;
    durability: number = 0;

    constructor(cardDef: CardDefinition, owner: Player, eventBus: EventBus) {
        super(cardDef, owner, eventBus);

        if (this.type !== CARD_TYPES.weapon) throw new RangeError(
            `Card definition has type: ${this.type}, expected: ${CARD_TYPES.weapon}`);

        this.attack = cardDef.attack || 0;
        this.durability = cardDef.durability || 0;
    }
}
class Hero extends Character {
    armor: number = 0;

    constructor(cardDef: CardDefinition, owner: Player, eventBus: EventBus) {
        super(cardDef, owner, eventBus);

        if (this.type !== CARD_TYPES.hero) throw new RangeError(
            `Card definition has type: ${this.type}, expected: ${CARD_TYPES.hero}`);

        this.armor = cardDef.armor || 0;
        //this.power = card_id ? or this.tags[battlecry () {change_power(card_id)}]
    }
}
class Power extends Card {
    attackedThisTurn: number;

    constructor(cardDef: CardDefinition, owner: Player, eventBus: EventBus) {
        super(cardDef, owner, eventBus);

        if (this.type !== CARD_TYPES.power) throw new RangeError(
            `Card definition has type: ${this.type}, expected: ${CARD_TYPES.power}`);

        //maybe rename to .usedThisTurn ?
        this.attackedThisTurn = 0; //applies to: Minion, Hero, Power
    }
}
class Enchantment extends Card {
    effects: any;

    constructor(cardDef: CardDefinition, owner: Player, eventBus: EventBus) {
        super(cardDef, owner, eventBus);

        if (this.type !== CARD_TYPES.enchantment) throw new RangeError(
            `Card definition has type: ${this.type}, expected: ${CARD_TYPES.enchantment}`);

        //console.log('EXCH', cardDef);
        //DESIGN BUG: clunky object shape
        // todo: finalize when SET attack/health/cost will be implemented
        this.effects = {};
        //_.pick (-_-)
        [
            'attack',
            'health',
            'cost',
            'tags',
            'durability',
            'death',
            'resource',
            'owner'
        ].forEach(prop => {
            const v = cardDef[prop];
            if (v) {
                this.effects[prop] = v;
            }
        }, this);

    }
}

class Game extends Entity {
    name = 'GAME_ENTITY';
    zone = ZONES.play;
    type = CARD_TYPES.game;

    turn: number = 0;

    isStarted: boolean = false;
    isOver: boolean = false;
    result: any = null;

    constructor(cardDef: CardDefinition, owner: null, eventBus: EventBus) {
        super(cardDef, eventBus);
    }
}

class Player extends Entity implements Cards.Player {
    name = 'PLAYER_UNKNOWN';
    zone: Types.ZonesAllCAPS = ZONES.aside;
    type = CARD_TYPES.player;

    deck: null;
    hand: null;
    hero: null;

    manaCrystals: number = 0;
    mana: number = 0;
    fatigue: number = 1;
    lost: boolean = false;

    constructor(cardDef: CardDefinition, owner: null, eventBus: EventBus) {
        super(cardDef, eventBus);

        if (this.type !== CARD_TYPES.player) throw new RangeError(
            `Card definition has type: ${this.type}, expected: ${CARD_TYPES.player}`);

        // this.manaCrystals = cardDef.manaCrystals || 0;
        this.manaCrystals = 0;
        this.mana = this.manaCrystals;
        this.fatigue = 1;
        this.lost = false;
    }
    draw (n: number) {
        throw 'Player.draw(n) is not implemented';
    }
    loose () {
      if (this.lost) throw 'Trying to loose the game twice - Infinite loop upon game end ?';
      console.warn(`player ${this.name} LOST the game`);
      this.lost = true;
    }
  }

/**
 * This function calculates final value of attribute
 *  after applying all currently active buffs on the card
 * @param prop Name of the prop in .effects object
 * @param initialValue
 */
function getter_of_buffed_atribute(this: Card, prop: string, initialValue: any) {
    if (!this.tags.length) return initialValue;

    const modifiers = this.tags.filter(v => (v.effects && (prop in v.effects)));
    if (!modifiers.length) {
        //console.log(this.tags);
        return initialValue;
    }
    //console.log(modifiers.length, this.buffs.length, this.incomingAuras.length);
    //console.log(modifiers, this.tags);

    const new_value = modifiers.reduce((a, v) => {
        const mutator = v.effects[prop];
        if (typeof mutator === 'number') {
            a += mutator;
        } else if (typeof mutator === 'function') {
            // mutator is <T>(_: T)=>T
            a = mutator(a);
        }
        return a;
    }, initialValue);

    console.log(`${this.zone} ${this} .${prop} is modified: ${initialValue} -> ${new_value}`);
    return new_value > 0 ? new_value : 0;
}

export {
    Card,
    Minion,
    Spell,
    Hero,
    Weapon,
    Power,
    Enchantment,
    Game,
    Player
};
