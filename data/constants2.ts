type UnionKeyToValue<U extends string, T> = {
  [K in U]: T;
}
type MapString<T> = {
  readonly [index: string]: T;
}
type U2<K extends string, T> = UnionKeyToValue<K, T> & MapString<T>;

export namespace Types {
  export type Zones = 'play'|'deck'|'hand'|'grave'|'aside';
  export type ZonesAllCAPS = 'PLAY'|'DECK'|'HAND'|'GRAVE'|'ASIDE';

  export type Cards = 'minion'|'spell'|'hero'|'weapon'|'power'|'enchantment';
  export type CardsAllCAPS = 'MINION'|'SPELL'|'HERO'|'WEAPON'|'HERO_POWER'|'ENCHANTMENT';

  export type Tags = 'taunt'|'enraged'|'divineShield';
}


// refer to http://hearthstone.gamepedia.com/Advanced_rulebook

// http://hearthstone.gamepedia.com/Zone_enumeration
const ZONES: U2<Types.Zones, string> = {
  deck: 'DECK',
  hand: 'HAND',
  play: 'PLAY',
  grave: 'GRAVE',
  aside: 'ASIDE', //setaside
  secret: 'SECRET',
  //
  //invalid: 'INVALID',
  //discard: 'DISCARD'
  //removedFromGame: 'REMOVEDFROMGAME' // o_O
};

const CARD_TYPES: U2<Types.Cards, string> = {
  minion: 'MINION',
  spell: 'SPELL',
  weapon: 'WEAPON',
  hero: 'HERO',
  power: 'HERO_POWER',
  enchantment: 'ENCHANTMENT'
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
  _pendingDestruction: '__DESTROY__' // check rulebook
};

const TAGS_LIST = Object.keys(TAGS).reduce<string[]>((a,k) => a.concat(TAGS[k]), []);

const EVENTS = {
  character_damaged: 'CHARACTER_DAMAGED',
  minion_summoned: 'MINION_SUMMONED',
  card_played: 'CARD_PLAYED',
  turn_started: 'TURN_STARTED'
};

/* @deprecated */
const ACTION_TYPES = {
  playCard: 'PLAY_CARD',
  attack: 'ATTACK',
  usePower: 'USE_POWER',
  endTurn: 'END_TURN',
  concede: 'CONCEDE'
};

export namespace GameOptions {
  type Card = any;
  type Character = Card;
  export type Types = 'ATTACK' | 'PLAY' | 'USE_POWER' | 'END_TURN' | 'CONCEDE';
  interface BaseAction {
      entity_id: number;
      entity: Card;
      type: Types; // ACTION_TYPES.playCard;
      name: string;
  }
  type Attack = {
      card_id: number;
      unit: Card; // read Object ?
      type: 'ATTACK'; // ACTION_TYPES.attack;
      name: string;
      cost: 0; // well.. attacking is free, right ? (only a life of your minion -__-)
      targetList: Character[];
  }
  type Play = {
      card_id: number;
      card: Card;
      type: 'PLAY'; // ACTION_TYPES.playCard;
      name: string;
      cost: number;
      positionList: number[]; //slots between tokens, lol ? //?
      targetList: Character[];
  };
  type EndTurn = {
      type: 'END_TURN'; // ACTION_TYPES.endTurn;
  }
  type Concede = {
      type: 'CONCEDE'; // ACTION_TYPES.concede;
  }
  export type Action = Attack | Play | EndTurn | Concede;
  export type Options = {
      token: string;
      actions: Action[];
  }
}

interface CardAction {
  destroy (): this;
  silence (): this;
  dealDamage (): this;
  dealDamageSpely (): this;
}

interface AoC<T extends {} = any> extends Array<T> {
  adjacent (x: any): this;
  exclude (x: any): this;
  getRandom (): this;
  destroy (): void;
  silence (): void;
  dealDamage (n: number): void;
  dealDamageSpell (n: number): void;

  // experimental
  heal (n: number): void;
}

type KnownEnvConstants = {
  $ (query: string): AoC;// any[];  // >
  readonly game: any;
  readonly self: any;
}

type KnownMechanics = {
  summon (id: string): void;
  draw (n: number): void;
  buff(id_or_tag: any, t: any): void;

  // experimental
  summonEnemy?(id: string): void;
}

type CardDefinitionBase = {
  id: string;
  _info: string;
  text: string;
  type: Types.CardsAllCAPS;
  name: string;
  playerClass: 'NEUTRAL';
  rarity: 'EPIC';
  collectible: boolean;
  race: string;

  cost?: number;
  attack?: number | any; // | (a: any)=>number;
  health?: number;
  armor?: number;
  durability?: number;

  _NOT_IMPLEMENTED_?: boolean;
}

type Trigger = {
  activeZone: 'play',
  eventName: string; // EVENTS.character_damaged,
  condition: any; //'self' | (options: KnownEnvConstants & KnownMechanics) => boolean;
  action (options: KnownEnvConstants & KnownMechanics): void;
};

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
  attack: any;
}

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
    EVENTS
};
