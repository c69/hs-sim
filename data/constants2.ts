type UnionKeyToValue<U extends string, T> = {
  [K in U]: T;
}
type MapString<T> = {
  readonly [index: string]: T;
}
type U2<K extends string, T> = UnionKeyToValue<K, T> & MapString<T>;
// ----

export namespace Types {
  export type Zones = 'play'|'deck'|'hand'|'grave'|'aside';
  export type Cards = 'minion'|'spell'|'hero'|'weapon'|'power'|'enchantment';
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

export {
    ZONES,
    CARD_TYPES,
    TAGS,
    TAGS_LIST,
    PLAYERCLASS,
    ACTION_TYPES,
    EVENTS
};
