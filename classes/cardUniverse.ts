const CardJSON = require('../data/cards.all.generated.json');
const abilitiesMixin = require('../data/actions.collectiblePlus.js');
import Card from './card';
import {
  CARD_TYPES,
  // ZONES
} from '../data/constants2';


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

let CardDefinitions = JSON.parse(JSON.stringify(CardJSON));
const CardDefinitionsIndex = CardDefinitions.reduce((a, v) => {
  a[v.id] = v;
  return a;
}, {});

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
  attack
  }) => {
  //console.log(id);
  if (attack) CardDefinitionsIndex[id].attack = attack;

  if (play) CardDefinitionsIndex[id].play = play;
  if (target) CardDefinitionsIndex[id].target = target;
  if (death) CardDefinitionsIndex[id].death = death;
  if (_triggers_v1) CardDefinitionsIndex[id]._trigger_v1 = _triggers_v1[0];
  if (tags) CardDefinitionsIndex[id].tags = tags;
  if (aura) CardDefinitionsIndex[id].aura = aura;
  if (enrage) CardDefinitionsIndex[id].enrage = enrage;

  if (xxx || xxx === 0) CardDefinitionsIndex[id]._NOT_IMPLEMENTED_ = true;
});

//---Deck2.js sketch------------------
let card_defs = CardDefinitions.filter(v => v.collectible === true)
  .filter(v => [CARD_TYPES.minion, CARD_TYPES.spell].includes(v.type))
  .filter(v => {
    if (v.type === CARD_TYPES.spell) return !!v.play;
    return true;
  })
  //.filter(v => !v._NOT_IMPLEMENTED_)
  .filter(v => [
    //'Chillwind Yeti',
    //'River Crocolisk',
    //'Bloodfen Raptor',
    //--
    //'Coin',
    //--spells:damage
//    'Fireball',
//    'Meteor',
    //'Arcane Explosion',
//    'Arcane Missiles',
    //      'Hellfire',
    //'Swipe',
    //'Assassinate',

    //--basic minions with tags or battlecries
//    'Flame Imp',
    //'Ironfur Grizzly',

    //'Leper Gnome',
//    'Unstable Ghoul',
    //'Ravaging Ghoul',
    //'Mad Bomber',
    //'Abomination',
    //'Elven Archer',
    //'Silent Knight', //-- stealth
    //'Annoy-o-Tron',
//    'Shielded Minibot',
//    'Argent Horseraider',
//    'Young Dragonhawk',
    // 'Thrallmar Farseer',

    // - silence
//    'Ironbeak Owl',
    //'Mass Dispel',

    // - give
    //'Bloodsail Raider',
    //'Windfury',
//    'Hand of Protection',
    // 'Shattered Sun Cleric',
    //'Windspeaker',
    //'Abusive Sergeant', // this turn
    //'Bloodlust', // this turn
    //'Houndmaster',
    //'Sunfury Protector', // adjacent
    // 'Defender of Argus', // adjacent
    //'Blessing of Wisdom',
//    'Aldor Peacekeeper',
    // 'Raging Worgen', //enrage

    // - aura
    //'Timber Wolf', //other
    // 'Flametongue Totem', //adjacent
    //'Tundra Rhino',
    //'Warsong Commander',
    // 'Stormwind Champion', //other
    //'Summoning Portal', //mana cost
    //'Molten Giant', //self cost
    //'Junkbot', //for its (5) 1/5

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
    // 'Acolyte of Pain',
    // 'Imp Gang Boss',
    // 'Starving Buzzard',
    // 'Patches the Pirate',
    //'Doomsayer',
    // 'Grim Patron',

  ].includes(v.name))
  ;
////

console.log('\n == Cards allowed: ==== \n', card_defs.map(v => v.name));

/**
 * todo: do we really need to couple card & player & eventBus
 */
function createCard(id, player, eventBus) {
  let card = CardDefinitionsIndex[id];
  if (!card) throw `Cannot find card with ID ${id}`;

  let structor = {
    [CARD_TYPES.minion]: Card.Minion,
    [CARD_TYPES.hero]: Card.Hero,
    [CARD_TYPES.weapon]: Card.Weapon,
    [CARD_TYPES.spell]: Card.Spell,
    [CARD_TYPES.power]: Card.Power,
    [CARD_TYPES.enchantment]: Card.Enchantment,
  }[card.type];

  let new_card = new structor(card, player, eventBus);
  return new_card;
}

/////


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
    'trigger'
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
  // bootstrap,
  CardDefinitionsIndex,
  card_defs as _cardDefinitionArray, //INTERNAL
  createCard,
  _progress
};
