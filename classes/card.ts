import {
    Types,
    ZONES,
    CARD_TYPES,
    CardDefinition,
    Cards,
    TAGS,
    PLAYERCLASS,
    EVENTS,
    EventBus,
    Effects
} from '../data/constants';

// import { getter_of_buffed_atribute } from './effects0';
import { computeState } from './effects3';

function createState ({
    cost = 0,
    attack = 0,
    tags = ([] as string[])
}): Effects.CardState {
    return {
        stats: {
            cost: cost,
            attack: attack
        },
        tags: new Set(tags),
        triggers: [],
        auras: [],
        deathrattles: []
    }
}

let card_id = 1;


class Card implements Cards.Card {
    zone: Types.ZonesAllCAPS;
    owner: Cards.Player;

    card_id: number;

    eventBus: EventBus; // :(
    _listener: any = null; // original implementation of triggers

    id: string;
    // dbfId: number;
    type: Types.CardsAllCAPS;
    name: string;
    text: string;
    // targetingArrowText: string;

    // todo: check deathknight cards ? maybe different Player/Card class
    playerClass: string; // .cardClass seems to be missing on some cards
    // .multiclass ?
    rarity: string;

    costBase: number;
    // overload: number;

    play: any;
    target: string;

    buffs: any[]; // @deprecated
    incomingAuras: any[]; // @deprecated

    _base = createState({});
    _current = createState({});
    _effects = {
        original: [] as Effects.AppliedBuff[],
        given: [] as Effects.AppliedBuff[],
        incomingAuraEffects: [] as Effects.AppliedBuff[]
    }
    // effects.from(arr);
    // effects.add(buff);
    // effects.projectAura(activatedAura);
    // effects.clearAuras();
    // effects.remove(buff); // by card_id or

    constructor(cardDef: CardDefinition, owner: Player, eventBus: EventBus) {
        if (!eventBus) throw new RangeError('EventBus required');
        this.eventBus = eventBus;

        if (!cardDef || typeof cardDef !== 'object') throw new TypeError('Object expected');
        if (!owner && !(
                cardDef.type === CARD_TYPES.game ||
                cardDef.type === CARD_TYPES.player
            )
        ) throw new RangeError('Owner player required');

        this.zone = ZONES.aside;
        this.owner = owner;

        this.card_id = card_id++;


        this.id = cardDef.id;
        //this.dbfId = cardDef.dbfId;
        this.type = cardDef.type;
        this.name = cardDef.name;
        this.text = cardDef.text;
        //this.targetingArrowText = cardDef.targetingArrowText;

        this.playerClass = cardDef.playerClass; // .cardClass seems to be missing on some cards
        //.multiclass
        this.rarity = cardDef.rarity;

        // this.overload = cardDef.overload;

        this.play = cardDef.play;
        this.target = cardDef.target;
        //this.chooseOne = ???
        //this.joust = ???


        const {
            on: triggers = [],
            aura: auras = [],
            death: deathrattles = []
        } = cardDef;

        // todo: add _recalc function
        if (this.type !== CARD_TYPES.enchantment) {
            this._effects.original = this._effects.original.concat([{
                result: {
                    tags: this.tags
                },
                _by: {
                    card_id: this.card_id, // :( expects enchantment
                    effects: {
                        triggers,
                        deathrattles,
                        auras
                    }
                }
            }]);
            this._base = createState({...{
                cost: cardDef.cost,
                attack: cardDef.attack,
                tags: cardDef.tags,
            }});

            this._refresh();
        }

        //this.buffs = (cardDef.tags || []).slice(0);
        //this.incomingAuras = [];
        //this.projectedAuras = [];
        //this.tags is a getter
    }
    get cost() {
        return this._current.stats.cost;
    }
    get tags() {
        return this._current.tags;
        //console.log(`card.tags: #${this.card_id}`);
        // const newMe = applyEffects(this);
    }
    _refresh () {
        this._current = computeState(this as any);
    }
    toString() {
        return `[${this.type}: ${this.name} #${this.card_id}]`;
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

        // todo: rewrite this
        this.attackBase = cardDef.attack || 0;
        //this.attack = this.attackBase;

        this.healthBase = cardDef.health || 0;
        this.health = this.healthBase;
        this.healthMax = this.healthBase; // in the beginning, all characters are at full health

        this.attackedThisTurn = 0; //applies to: Minion, Hero, Power
    }
    get attack() {
        // return getter_of_buffed_atribute.call(this, 'attack', this.attackBase);
        // const newMe = applyEffects(this);
        // return newMe ? newMe.attack : this.attackBase; // o yeah, no attackBase
        return this._current.stats.attack;
    }
    _damageApply(n: number, type = '') {
        if (!Number.isInteger) throw new RangeError(`Damage must be integer number, instead got ${n}`);
        let was = this.health;

        if (n > 0 && this.tags.has(TAGS.divineShield)) {
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
        return this.health > 0 && !this.tags.has(TAGS._pendingDestruction);
    }
}

class Minion extends Character {
    race: string;
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
class Enchantment extends Card implements Effects.CardEntity_buff {
    effects = {};

    constructor(cardDef: CardDefinition, owner: Player, eventBus: EventBus) {
        super(cardDef, owner, eventBus);

        if (this.type !== CARD_TYPES.enchantment) throw new RangeError(
            `Card definition has type: ${this.type}, expected: ${CARD_TYPES.enchantment}`);

        //console.log('EXCH', cardDef);
        //DESIGN BUG: clunky object shape
        // todo: finalize when SET attack/health/cost will be implemented
        this.effects = {};
        //_.pick (-_-)
        //  cannot use -> as keyof Effects.CardEntity_buff["effects"]
        // because there is (1) renaming and (2) moving happeing
        ([
            'attack',
            'health',
            'cost',
            'tags',
            'durability',
            'death',
            //'resource',
            //'owner'
        ]).forEach((prop) => {
            let v = cardDef[prop];
            if (v) {
                this.effects[prop] = v; // will fail for .death -> .deathrattles
            }
        }, this);
    }
}

class Game extends Card {
    card_id: number;
    name: 'GAME_ENTITY';
    zone: 'PLAY';
    owner: Player = null;
    type: 'GAME';

    turn: number = 0;

    isStarted: boolean = false;
    isOver: boolean = false;
    result: any = null;

    constructor(cardDef: CardDefinition, owner: null, eventBus: EventBus) {
        super(cardDef, null, eventBus);
    }
}

class Player extends Card implements Cards.Player {
    card_id: number;
    name = 'PLAYER_UNKNOWN';
    zone: Types.ZonesAllCAPS = 'ASIDE';
    owner: Player = null;
    type: 'PLAYER';

    deck: null;
    hand: null;
    hero: null;

    manaCrystals: number = 0;
    mana: number = 0;
    fatigue: number = 1;
    lost: boolean = false;

    constructor(cardDef: CardDefinition, owner: null, eventBus: EventBus) {
        super(cardDef, null, eventBus);

        if (this.type !== CARD_TYPES.player) throw new RangeError(
            `Card definition has type: ${this.type}, expected: ${CARD_TYPES.player}`);

        this.name = cardDef.name;
        this.owner = this;

        // this.manaCrystals = cardDef.manaCrystals || 0;
        this.manaCrystals = 0;
        this.mana = this.manaCrystals;
        this.fatigue = 1;
        this.lost = false;
    }
    draw (n: number) {
        // ...
    }
    loose () {
        if (this.lost) throw 'Trying to loose the game twice - Infinite loop upon game end ?';
        console.warn(`player ${this.name} LOST the game`);
        this.lost = true;
    }
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
}
