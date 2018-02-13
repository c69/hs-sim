import {
    ZONES,
    CARD_TYPES as TYPES,
    TAGS,
    // PLAYERCLASS,
    EVENTS
} from '../data/constants2';

import {
    effectReducer,
    EffectTarget
} from './effects';

type Player = any;
type UserFunction = (...a: any[]) => void;

type CardDefinition = {
    id: string;
    _info: string;
    text: string;
    type: 'MINION' | string;
    name: string;
    playerClass: 'WARRIOR' | string;
    rarity: 'RARE' | string;
    collectible: boolean;

    cost?: number;
    attack?: number;
    health?: number;
    armor?: number

    tags?: string[];
    target?: string;
    play?: UserFunction;
    death?: UserFunction[];
    // _triggers_v1: UserFunction[];
    //aura:,
    //enrage,
    overload?: number;
    xxx?: any,
};

interface BaseCardMetadata extends EffectTarget {
    id: string;
    // dbfId?: string;

    type: string;
    name: string;
    text: string;
    // targetingArrowText?: string;

    playerClass: string; // .cardClass seems to be missing on some cards
    // multiclass:
    rarity: string;

    cost: number;
    // overload?: number;

    // play?: (a: any) => void;
    // target?: string;
    //this.chooseOne = ???
    //this.joust = ???

    zone: string;
    owner: Player; // Player

    card_id: number;
}
declare var BaseCard: {
    new(definition: CardDefinition, owner: Player): BaseCardMetadata;
}

let card_id = 1;

class Card2 implements EffectTarget, BaseCardMetadata{
    constructor (def: CardDefinition, owner: Player) {
        this._serialNumber = ++card_id;

        const {
          id,
          type,
          name,
          text,
          playerClass,
          rarity,

        } = def;
        this.metadata = {};
        this.statsBase = {};
        this.zone = ZONES.aside;
        this.owner = owner;
        // this.stats = effectReducer(statsBase);
    }
}


class Card implements BaseCardMetadata {
    id: string;
    //this.dbfId = cardDef.dbfId;
    type: string;
    name: string;
    text: string;
    targetingArrowText: string;

    playerClass: string; // .cardClass seems to be missing on some cards
    //.multiclass
    rarity: string;

    cost: number;
    overload: number;

    play?: (a: any) => void;
    target?: string;
    //this.chooseOne = ???
    //this.joust = ???


    zone: string = ZONES.deck;
    owner: Player; // Player

    card_id: number = 0;

    constructor(cardDef: CardDefinition, owner: Player) {
        if (!cardDef || typeof cardDef !== 'object') throw new TypeError('Object expected');
        if (!owner) throw new RangeError('Owner player required');


        this.id = cardDef.id;
        //this.dbfId = cardDef.dbfId;
        this.type = cardDef.type;
        this.name = cardDef.name;
        this.text = cardDef.text;
        //this.targetingArrowText = cardDef.targetingArrowText;

        this.playerClass = cardDef.playerClass; // .cardClass seems to be missing on some cards
        //.multiclass
        this.rarity = cardDef.rarity;

        // this.costBase = cardDef.cost;
        this.overload = cardDef.overload;

        this.play = cardDef.play;
        this.target = cardDef.target;
        //this.chooseOne = ???
        //this.joust = ???

        this.buffs = (cardDef.tags || []).slice(0);
        this.incomingAuras = [];
        //this.tags is a getter

        //   if (cardDef.death) {
        //     this.buffs.push({//potentially shuld be .concat, as potentially card can have multiple deathrattles, even initially
        //       death: cardDef.death
        //     });
        //   }
        //   if (cardDef._trigger_v1) {
        //     this.buffs.push({ //potentially shuld be .concat, as potentially card can have multiple triggers
        //       trigger: cardDef._trigger_v1
        //     });
        //   }
        //   if (cardDef.aura) {
        //     this.buffs.push({//potentially shuld be .concat, as potentially card can have multiple auras
        //       aura: cardDef.aura
        //     });
        //   }

        this.zone = ZONES.deck;
        this.owner = owner;

        this.card_id = card_id++;
    }

    _draw() {
        if (this.zone !== ZONES.deck) throw `Attempt to draw ${this.name} #${this.card_id} NOT from deck, but from: ${this.zone}`;
        this.zone = ZONES.hand;
    }
    _play() {
        if (this.type === TYPES.enchantment) {
            // no idea from which zone to play it ..
        } else {
            if (this.zone !== ZONES.hand) throw `Attempt to play card NOT from hand: ${this.name} #${this.card_id}, but from: ${this.zone}`;
        }
        this.zone = ZONES.aside;

        // todo: consider splitting this IF so proper event could be emitted
        if (this.type === TYPES.minion || this.type === TYPES.weapon) {
            this.zone = ZONES.play;
        } else if (this.type === TYPES.spell) {
            //todo: implements secrets
            this.zone = this.isSecret ? ZONES.secret : ZONES.grave;
        } else if (this.type === TYPES.enchantment) {
            this.zone = ZONES.play;
        } else {
            throw `Played card of unplayable type:${this.type}`;
        }
    }
    _summon() {
        this.zone = ZONES.play;

        this.eventBus.emit(EVENTS.minion_summoned, {
            target: this
        });

        //console.log(`card.js :: summoned ${this.name} for ${this.owner.name}`);
    }
    _mill() {
        this.zone = ZONES.grave;
    }
    _die() {
        console.log(`☠️ ${this.type.toLowerCase()} died: ${this.owner.name}'s ${this.name}`);
        //this.death && this.death({self: this, $: game.board.$, game}); // deathrattle
        this.zone = ZONES.grave;
    }
    _copy() {
        let copy = new this.constructor.prototype(this, this.owner);
        // copy.tags[] are DIRTY !
        copy.zone = ZONES.aside;
    }
    toString() {
        return `[Object Card ${this.type}: ${this.name} #${this.card_id}]`;
    }
}

class Character extends Card {
    constructor(cardDef: CardDefinition, owner: Player) {
        super(cardDef, owner);

        this.attackBase = cardDef.attack || 0;
        //this.attack = this.attackBase;

        this.healthBase = cardDef.health || 0;
        this.health = this.healthBase;
        this.healthMax = this.healthBase; // in the beginning, all characters are at full health

        this.attackedThisTurn = 0; //applies to: Minion, Hero, Power
    }

    _damageApply(n: number, type = '') {
        if (!Number.isInteger) throw new RangeError(`Damage must be integer number, instead got ${n}`);
        let was = this.health;

        if (n > 0 && this.tags.includes(TAGS.divineShield)) {
            this.buffs = this.buffs.filter(v => v !== TAGS.divineShield); // = "removeTag"
            console.log(`(!) ${this.name} loses ${TAGS.divineShield} !`);
        } else {
            this.health -= n;
        }
        let received_damage = was - this.health;
        received_damage > 0 && console.log(`${type && '🔥 '}${this.name} takes ${received_damage} ${type} damage!`);

        if (received_damage) {
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
        console.log(`${this.owner.name}'s ${this.name} #${this.card_id} got SILENCED!`);
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
    constructor(cardDef: CardDefinition, owner: Player) {
        super(cardDef, owner);
        if (this.type !== TYPES.minion) throw new RangeError(
            `Card definition has type: ${this.type}, expected: ${TYPES.minion}`);

        this.race = cardDef.race; // or undefined

        this.isReady = false; //applies only to minion - initial ZZZ / sleep
    }
}
class Spell extends Card {
    constructor(cardDef: CardDefinition, owner: Player) {
        super(cardDef, owner);
        if (this.type !== TYPES.spell) throw new RangeError(
            `Card definition has type: ${this.type}, expected: ${TYPES.spell}`);

        //this.secret = cardDef.secret; //must be a function
        //this.quest = cardDef.quest; //must be a function
    }
}
class Weapon extends Card {
    constructor(cardDef: CardDefinition, owner: Player) {
        super(cardDef, owner);
        if (this.type !== TYPES.weapon) throw new RangeError(
            `Card definition has type: ${this.type}, expected: ${TYPES.weapon}`);

        this.attack = cardDef.attack || 0;
        this.durability = cardDef.durability || 0;
    }
}
class Hero extends Character {
    constructor(cardDef: CardDefinition, owner: Player) {
        super(cardDef, owner);
        if (this.type !== TYPES.hero) throw new RangeError(
            `Card definition has type: ${this.type}, expected: ${TYPES.hero}`);

        this.armor = cardDef.armor || 0;
        //this.power = card_id ? or this.tags[battlecry () {change_power(card_id)}]
    }
    _die() {
        super._die();
        this.owner.loose();
    }
}
class Power extends Card {
    constructor(cardDef: CardDefinition, owner: Player) {
        super(cardDef, owner);
        if (this.type !== TYPES.power) throw new RangeError(
            `Card definition has type: ${this.type}, expected: ${TYPES.power}`);

        //maybe rename to .usedThisTurn ?
        this.attackedThisTurn = 0; //applies to: Minion, Hero, Power
    }
}
class Enchantment extends Card {
    constructor(cardDef: CardDefinition, owner: Player) {
        super(cardDef, owner);
        if (this.type !== TYPES.enchantment) throw new RangeError(
            `Card definition has type: ${this.type}, expected: ${TYPES.enchantment}`);

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
            let v = cardDef[prop];
            if (v) {
                this.effects[prop] = v;
            }
        }, this);


    }
}

console.log(Card);

export {
    Card,
    Minion,
    Spell,
    Hero,
    Weapon,
    Power,
    Enchantment
}