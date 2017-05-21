'use strict';
// @ts-check

const ZONES = {
  deck: 'DECK',
  hand: 'HAND',
  play: 'PLAY',
  grave: 'GRAVE',
  aside: 'ASIDE',
  secret: 'SECRET'
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
  charge: 'CHARGE',
  divineShield: 'DIVINE_SHIELD'
};

module.exports = {
    ZONES,
    CARD_TYPES,
    TAGS,
    PLAYERCLASS
};