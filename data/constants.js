'use strict';
// @ts-check

// refer to http://hearthstone.gamepedia.com/Advanced_rulebook

// http://hearthstone.gamepedia.com/Zone_enumeration
const ZONES = {
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

const CARD_TYPES = {
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

const TAGS = {
  taunt: 'TAUNT',
  divineShield: 'DIVINE_SHIELD',
  charge: 'CHARGE',
  windfury: 'WINDFURY',
  stealth: 'STEALTH',
  silence: 'SILENCE',
  enraged: 'ENRAGED',
  _pendingDestruction: '__DESTROY__' // check rulebook
};

const TAGS_LIST = Object.keys(TAGS).reduce((a,v) => a.concat(TAGS[v]),[]);

const EVENTS = {
  character_damaged: 'CHARACTER_DAMAGED',
  minion_summoned: 'MINION_SUMMONED',
  card_played: 'CARD_PLAYED',
  turn_started: 'TURN_STARTED'
};

const ACTION_TYPES = {
  playCard: 'PLAY_CARD',
  attack: 'ATTACK',
  usePower: 'USE_POWER',
  endTurn: 'END_TURN',
  concede: 'CONCEDE'
};

module.exports = {
    ZONES,
    CARD_TYPES,
    TAGS,
    TAGS_LIST,
    PLAYERCLASS,
    ACTION_TYPES,
    EVENTS
};