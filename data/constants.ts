type UnionKeyToValue<U extends string, T> = {
  [K in U]: T;
};
type MapString<T> = {
  readonly [index: string]: T;
};
export type U2<K extends string, T> = UnionKeyToValue<K, T> & MapString<T>;

export namespace Types {
  export type Zones = 'play'|'deck'|'hand'|'grave'|'aside';
  export type ZonesAllCAPS = 'PLAY'|'DECK'|'HAND'|'GRAVE'|'ASIDE';

  export type Cards = 'minion'|'spell'|'hero'|'weapon'|'power'|'enchantment|game|player';
  export type CardsAllCAPS = 'MINION'|'SPELL'|'HERO'|'WEAPON'|'HERO_POWER'|'ENCHANTMENT'|'GAME'|'PLAYER';

  export type Tags = 'taunt'|'enraged'|'divineShield';
}

// refer to http://hearthstone.gamepedia.com/Advanced_rulebook

// http://hearthstone.gamepedia.com/Zone_enumeration
const ZONES = {
  deck: 'DECK' as 'DECK',
  hand: 'HAND' as 'HAND',
  play: 'PLAY' as 'PLAY',
  grave: 'GRAVE' as 'GRAVE',
  aside: 'ASIDE' as 'ASIDE', //setaside
  secret: 'SECRET' as 'SECRET',
  //
  //invalid: 'INVALID',
  //discard: 'DISCARD'
  //removedFromGame: 'REMOVEDFROMGAME' // o_O
};

const CARD_TYPES = {
  minion: 'MINION' as 'MINION',
  spell: 'SPELL' as 'SPELL',
  weapon: 'WEAPON' as 'WEAPON',
  hero: 'HERO' as 'HERO',
  power: 'HERO_POWER' as 'HERO_POWER',
  enchantment: 'ENCHANTMENT' as 'ENCHANTMENT',

  player: 'PLAYER' as 'PLAYER',
  game: 'GAME' as 'GAME',

};

const PLAYERCLASS = {
  mage: 'MAGE',
  priest: 'PRIEST',
  warlock: 'WARLOCK',
  paladin: 'PALADIN',
  warrior: 'WARRIOR',
  rogue: 'ROGUE',
  hunter: 'HUNTER',
  druid: 'DRUID',
  shaman: 'SHAMAN',
  //
  neutral: 'NEUTRAL',
  //
  dream: 'DREAM'
};

const TAGS: U2<Types.Tags, string> = {
  taunt: 'TAUNT',
  divineShield: 'DIVINE_SHIELD',
  charge: 'CHARGE',
  windfury: 'WINDFURY',
  stealth: 'STEALTH',
  silence: 'SILENCE',
  enraged: 'ENRAGED',
  cant_attack: 'CANT_ATTACK',
  _pendingDestruction: '__DESTROY__' // check rulebook
};

const TAGS_LIST = Object.keys(TAGS).reduce<string[]>((a,k) => a.concat(TAGS[k]), []);

const EVENTS = {
  character_damaged: 'CHARACTER_DAMAGED',
  minion_summoned: 'MINION_SUMMONED',
  card_played: 'CARD_PLAYED',
  turn_started: 'TURN_STARTED',
  turn_ended: 'TURN_ENDED'
};

interface EventBus {
  emit (a: any, b: any): any;
  removeListener (a: any, b: any): void;
}

/* @deprecated */
const ACTION_TYPES = {
  playCard: 'PLAY_CARD' as 'PLAY_CARD',
  attack: 'ATTACK' as 'ATTACK',
  usePower: 'USE_POWER' as 'USE_POWER',
  endTurn: 'END_TURN' as 'END_TURN',
  concede: 'CONCEDE' as 'CONCEDE'
};

/**
 * @see ..\classes\arrayOfCards.ts
 */
type TypedArrayHS<C extends Cards.Card> = C[];
export interface AoC<
  T extends Cards.Card = Cards.Card
> extends TypedArrayHS<T> {

/* DOES NOT WORK - attempt to make generic .filter
  filter<S extends T = T>(callbackfn: (
      value: S,
      index: number,
      array: S[]
    ) => value is S, thisArg?: any
  ): AoC<S>;
*/
  // from (x: T[]): AoC<T>;
  [position: number]: T;

  adjacent (x: Cards.Card): AoC<T>;
  exclude (x: Cards.Card): AoC<T>;
  getRandom (): AoC<T>;

  destroy (): void;
  silence (): void;
  dealDamage (n: number): void;
  dealDamageSpell (n: number): void;

  // experimental
  heal? (n: number): void;
}

export namespace Cards {
  export type LegacyBuff = {
    type: string;
    aura?: {
      zone: string;
      target: string;
      buff: any; // o_O
    };
    death? (o: {}): void;
    trigger? (): void;
  };
  export interface Entity {
    entity_id: number;
    readonly type: Types.CardsAllCAPS | 'GAME' | 'PLAYER'; // todo rename that union
    zone: Types.ZonesAllCAPS;
    name: string;
  }
  export interface Card extends Entity {
    readonly type: Types.CardsAllCAPS;

    readonly text: string;
    owner: Player;

    tags: (string | LegacyBuff)[];
    incomingAuras?: LegacyBuff[];

    _listener?: [any, any];

    target?: string;
    // play (): void;
    play?: CardAbilities['play'];
    cost?: number;

    [key: string]: any;
  }
  export interface Player extends Entity {
    type: 'PLAYER';

    manaCrystals: number;
    mana: number;
    fatigue: number;

    deck: any;
    hand: any;
    hero: any;

    /** @deprecated this is being overwritten on the instance in board5.ts */
    draw: (n: number) => void;

    loose: () => void;
    lost: boolean;
  }
  export interface Character extends Card {
    type: 'MINION' | 'HERO';
    attack: number;
    health: number;
    isReady: boolean;
    attackedThisTurn: number;
    isAlive (): boolean;
  }
  export interface Spell extends Card {
    type: 'SPELL';
  }
  export interface PlayableCard extends Card {
    cost: number;
  }
}

export namespace StateMachine {
  // see: board7.ts !
}

export namespace GameOptions {
  export type Types = 'ATTACK' | 'PLAY_CARD' | 'USE_POWER' | 'END_TURN' | 'CONCEDE';
  interface BaseAction {
    type: Types;
    entity_id: number;
    entity: Cards.Card;
    name: string;
  }
  export interface Attack {
      type: 'ATTACK'; // ACTION_TYPES.attack;
      /** @deprecated - keep till client is updated */
      card_id: number;
      unit: Cards.Character;
      name: string;
      // cost: 0; // well.. attacking is free, right ? (only a life of your minion -__-)
      targetList: Cards.Character[];
  }
  export interface Play {
      type: 'PLAY_CARD'; // ACTION_TYPES.playCard;
      /** @deprecated - keep till client is updated */
      card_id: number;
      card: Cards.PlayableCard;
      name: string;
      cost: number;
      positionList: number[]; //slots between tokens, lol ? //?
      targetList?: Cards.Character[];
  }
  interface EndTurn {
      type: 'END_TURN'; // ACTION_TYPES.endTurn;
  }
  interface Concede {
      type: 'CONCEDE'; // ACTION_TYPES.concede;
  }
  export type Action = Attack | Play | EndTurn | Concede;
  export interface Options {
      token?: string;
      actions: Action[];
  }
}

interface CardAction {
  destroy (): this;
  silence (): this;
  dealDamage (): this;
  dealDamageSpely (): this;
}

interface KnownEnvConstants {
  readonly game: any;
  readonly self: any;
  readonly position?: number; // only for play() of minion ?
  $ (query: string): AoC;// any[];  // >
}

interface KnownMechanics {
  summon (id: string): void;
  draw (n: number): void;
  buff(id_or_tag: any, t: any): void;

  // experimental
  summonEnemy(id: string): void;
}

interface CardDefinitionBase {
  readonly id: string;
  readonly type: Types.CardsAllCAPS;
  readonly name: string;

  _info: string;
  text: string;

  playerClass?: 'NEUTRAL'; // lol
  rarity?: 'EPIC'; // lol
  collectible?: boolean;
  race?: string;

  cost?: number;
  attack?: number | any; // | (a: any)=>number;
  health?: number;
  armor?: number;
  durability?: number;

  _NOT_IMPLEMENTED_?: boolean;

  [key: string]: any;
}

interface Trigger {
  activeZone: 'play';
  eventName: string; // EVENTS.character_damaged,
  condition: any; //'self' | (options: KnownEnvConstants & KnownMechanics) => boolean;
  action (options: KnownEnvConstants & KnownMechanics): void;
}

type CardAbilities = {
  readonly id: string;
  readonly _info: string;
  readonly text: string;

  overload?: number;
  enrage?: any;
  aura?: any;
  xxx?: string | number;
  _trigger_v1?: Trigger; // in CardUniverse
  _triggers_v1?: Trigger[]; // in actions

  death?: (options: KnownEnvConstants & KnownMechanics) => void;
  play?: (options: {target: any} & KnownEnvConstants & KnownMechanics) => void;
  target?: string;
  tags?: string[];

  /** @deprecated */
  attack?: any;
};

type CardDefinition = CardDefinitionBase & CardAbilities;
type XXX_ZONE = Types.ZonesAllCAPS;
type XXX_CARD = Types.CardsAllCAPS;
export {
    ZONES,
    XXX_ZONE,
    CARD_TYPES,
    XXX_CARD,
    CardAbilities,
    CardDefinition,
    KnownMechanics,
    TAGS,
    TAGS_LIST,
    PLAYERCLASS,
    ACTION_TYPES,
    EVENTS,
    EventBus
};
