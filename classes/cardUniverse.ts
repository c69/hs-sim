/// <reference types="node" />

import {
  CARD_TYPES,
  CardDefinition,
  EventBus
  // ZONES
} from '../data/constants';

const CardDefinitions = require('../data/cards.all.generated.json')  as Readonly<CardDefinition>[];

import abilitiesMixin from '../data/actions.collectiblePlus';
import {
  Card,
  Minion,
  Spell,
  Hero,
  Weapon,
  Power,
  Enchantment,
  Game,
  Player
} from './card';


/** @private maybe its time to stop hubris and add lodash .. */
function _pick (obj: object, props: string[]) {
  const a = new Set([].concat(props));
  const r = {};
  for (let k in obj) {
    if (a.has(k)) {
      r[k] = obj[k];
    }
  }
  return r;
}

const CardDefinitionsIndex = CardDefinitions.reduce((a, v) => {
  a[v.id] = v;
  return a;
}, {} as {[key: string]: CardDefinition});

abilitiesMixin.forEach(({
  //long destructuring
  id,
  tags,
  target,
  play,
  death,
  _triggers_v1,
  aura,
  enrage,
  xxx,

  attack,
  health,
  cost
  }) => {
  //console.log(id);
  if (attack) CardDefinitionsIndex[id].attack = attack;

  if (tags) CardDefinitionsIndex[id].tags = tags;
  if (target) CardDefinitionsIndex[id].target = target;
  if (play) CardDefinitionsIndex[id].play = play;
  if (death) CardDefinitionsIndex[id].death = death;
  if (aura) CardDefinitionsIndex[id].aura = aura;
  if (_triggers_v1) CardDefinitionsIndex[id]._trigger_v1 = _triggers_v1[0];
  // if (enrage) CardDefinitionsIndex[id].enrage = enrage;

  if (xxx || xxx === 0) CardDefinitionsIndex[id]._NOT_IMPLEMENTED_ = true;
});

//---Deck2.js sketch------------------
const DECKS = {
  summerParty: [
    'Fireball',
    'Meteor',
    'Arcane Missiles',
    'Flame Imp',
    'Unstable Ghoul',
    'Shielded Minibot',
    'Argent Horseraider',
    'Young Dragonhawk',
    'Ironbeak Owl',
    'Hand of Protection',
    'Aldor Peacekeeper',
    'Unleash the Hounds',
    'Knife Juggler',
  ],
  HeyCatch: [
    'Knife Juggler'
  ],
  DieInsect: [
    'Ragnaros the Firelord'
  ],
  Fuu: [
    'Flame Imp'
  ],
  everyone: [
    //'Chillwind Yeti',
    //'River Crocolisk',
    //'Bloodfen Raptor',
    //--
    //'Coin',
    //--spells:damage
    'Fireball',
    'Meteor',
    'Arcane Explosion',
    'Arcane Missiles',
    'Hellfire',
    'Swipe',
    'Assassinate',

    //--basic minions with tags or battlecries
    'Flame Imp',
    'Ironfur Grizzly',

    'Leper Gnome',
    'Unstable Ghoul',
    //'Ravaging Ghoul',
    //'Mad Bomber',
    'Abomination',
    //'Elven Archer',
    //'Silent Knight', //-- stealth
    'Annoy-o-Tron',
    'Shielded Minibot',
    'Argent Horseraider',
    'Young Dragonhawk',
    // 'Thrallmar Farseer',

    // - silence
    'Ironbeak Owl',
    //'Mass Dispel',

    // - give
    //'Bloodsail Raider',
    'Windfury',
    'Hand of Protection',
    // 'Shattered Sun Cleric',
    //'Windspeaker',
    //'Abusive Sergeant', // this turn
    //'Bloodlust', // this turn
    //'Houndmaster',
    //'Sunfury Protector', // adjacent
    'Defender of Argus', // adjacent
    //'Blessing of Wisdom',
    'Aldor Peacekeeper',
    // 'Raging Worgen', //enrage

    // - aura
    'Timber Wolf', //other
    'Flametongue Totem', //adjacent
    'Tundra Rhino',
    //'Warsong Commander',
    'Stormwind Champion', //other
    'Summoning Portal', //mana cost
    // 'Molten Giant', //self cost - NOT WORKING !
    'Junkbot', //for its (5) 1/5

    //--summon
    //'Blood To Ichor',
    // 'Murloc Tidehunter',
    //'Leeroy Jenkins',
    //'Mirror Image',
  //    'Unleash the Hounds',
    //'Dreadsteed',
    // 'Sludge Belcher',


    //--trigger, MVP minions
    'Knife Juggler',
    'Acolyte of Pain',
    'Imp Gang Boss',
    // 'Starving Buzzard',
    // 'Patches the Pirate',
    //'Doomsayer',
    'Grim Patron',
    'Ragnaros the Firelord'
  ]
};

const theDeck = DECKS.everyone;
// const theDeck = DECKS.summerParty;
// const theDeck = DECKS.HeyCatch;
// const theDeck = DECKS.DieInsect;
// const theDeck = DECKS.Fuu;

let card_defs = CardDefinitions.filter(v => v.collectible === true)
  .filter(v => {
    return v.type === CARD_TYPES.minion || v.type === CARD_TYPES.spell;
  })
  .filter(v => {
    if (v.type === CARD_TYPES.spell) return !!v.play;
    return true;
  })
  //.filter(v => !v._NOT_IMPLEMENTED_)
  .filter(v => theDeck.includes(v.name));
/////
console.log('\n == Cards allowed: ==== \n', card_defs.map(v => v.name));
/////


/**
 * todo: do we really need to couple card & player & eventBus
 */
function createCard(id: string, player: Player, eventBus: EventBus) {
  let card = CardDefinitionsIndex[id];
  if (!card) throw `Cannot find card with ID ${id}`;

  let C = CARD_TYPES;
  let _ = null;
  switch (card.type) {
    case C.minion: _ = Minion; break;
    case C.hero: _ = Hero; break;
    case C.weapon: _ = Weapon; break;
    case C.spell: _ = Spell; break;
    case C.power: _ = Power; break;
    case C.enchantment: _ = Enchantment; break;
//  case C.game: _ = Game; break;
//  case C.player: _ = Player; break;
    default: throw 'Attempt to create card of invalid type';
  }
  let new_card = new _ (
    card,
//  (card.type === C.player || card.type === C.game) ? null : player,
    player,
    eventBus
  );
  return new_card as Card;
}

/////
function shuffle (arr: any[]): any[] {
  // TODO: shuffle
  return arr;
}
// function cardFromName (name: string): Card {
//   // TODO: find by name
//   return new Card();
// }


let coolCards = abilitiesMixin.filter(v => {
  let keys = Reflect.ownKeys(v);

  let [id, _info] = keys;
  if (keys.length === 2 && id === 'id' && _info === '_info') {
    return false;
  }
  return true;
});

let progressOfCards = coolCards.reduce((a, v) => {
  let keys = Reflect.ownKeys(v) as string[]; //TODO: check what is signature of Reflect.ownKeys

  let [id, _info, text] = keys;
  if (keys.length === 3 && id === 'id' && _info === '_info' && text === 'text') {
    a.not_started += 1;
    return a;
  }

  let hasWeirdProps = keys.some(k => ![
    'id',
    '_info',
    'text',
    'play',
    'death',
    'target',
    'tags',
    // 'trigger'
  ].includes(k));
  if (hasWeirdProps) {
    a.in_progress += 1;
    return a;
  }

  a.done += 1;
  return a;
}, {
    done: 0,
    in_progress: 0,
    not_started: 0
  });

/**
 * Just console.log the progress stats
 */
function _progress() {
  console.log(`~~~~~~\n card implementation progress (of ${abilitiesMixin.length}):`, progressOfCards);
  //card implementation progress (of 1206): { done: 41, in_progress: 7, not_started: 1110 }
}

export {
  CardDefinitionsIndex,
  card_defs as _cardDefinitionArray, //INTERNAL
  createCard,
  _progress
};
