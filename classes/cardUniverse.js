'use strict';
//@ts-check

const CardJSON = require('../data/cards.all.generated.json');
const abilitiesMixin = require('../data/actions.collectiblePlus.js');
const Card = require('./card.js');
const Deck = require('./deck.js');

//const Board = require('./classes/board.js');
const {
  CARD_TYPES, // ! destructuring - so the renaming order is NON-OBVIOUS
  ZONES
} = require('../data/constants.js');


let CardDefinitions = JSON.parse(JSON.stringify(CardJSON));
const CardDefinitionsIndex = CardDefinitions.reduce((a,v) => {
  a[v.id] = v;
  return a;
}, {});
abilitiesMixin.forEach(({id, tags, target, play, death, _triggers_v1}) => {
  //console.log(id);
  try {
    if (play) CardDefinitionsIndex[id].play = play;
    if (target) CardDefinitionsIndex[id].target = target;
    if (death) CardDefinitionsIndex[id].death = death;
    if (_triggers_v1) CardDefinitionsIndex[id]._trigger_v1 = _triggers_v1[0];
    if (tags) CardDefinitionsIndex[id].tags = tags; 
  } catch (err) {
    console.warn(err, CardDefinitionsIndex[id]);
  }
});

//---Deck2.js sketch------------------
let card_defs = CardDefinitions.filter(v => v.collectible === true)
    .filter(v => [CARD_TYPES.minion, CARD_TYPES.spell].includes(v.type))
    .filter(v => [
      //'Chillwind Yeti',
      //'River Crocolisk',
      //'Bloodfen Raptor',
//--spells:damage
//      'Fireball',
      'Arcane Explosion',
      //'Arcane Missiles',
//      'Hellfire',
      'Swipe',

//--basic minions with tags or battlecries
      'Flame Imp',
      //'Ironfur Grizzly',
      'Ironbeak Owl',
      //'Leper Gnome',
      'Unstable Ghoul',
      //'Abomination',
      'Elven Archer',
      //'Silent Knight', //-- stealth
      //'Annoy-o-Tron',
      //'Shielded Minibot',
      // 'Argent Horseraider',
      //'Young Dragonhawk',
      // 'Thrallmar Farseer',
      
//--summon
      'Murloc Tidehunter',
      //'Leeroy Jenkins',
      'Mirror Image',

//--trigger, MVP minions
      'Knife Juggler',
      'Acolyte of Pain',
      //'Imp Gang Boss',
      'Starving Buzzard',
      //'Patches the Pirate',
      //'Doomsayer',
      //'Grim Patron',

    ].includes(v.name))
    ;
    ////

/**
 * @param {Array} arr1 
 * @param {Array} arr2 
 * @param {Object} eb 
 */
function bootstrap (arr1, arr2, eb) {
    [
        arr1.concat(eb),
        arr2.concat(eb)
    ].forEach(function(arr) {
        bootstrapPlayer(...arr);
    });
}

/**
 * 
 * @param {Player} player 
 * @param {string} hero_card_id 
 * @param {Array} starting_deck 
 * @param {Object} eventBus 
 */
function bootstrapPlayer (player, hero_card_id, starting_deck, eventBus) {
    player.deck = new Deck([
        new Card.Hero(CardDefinitionsIndex[hero_card_id], player, eventBus)
    ]);
    let deck = player.deck._arr;
    deck[0].zone = ZONES.play;

    //deck.push(new Card.Hero(CardDefinitionsIndex[hero_card_id], player, eventBus));
    //deck[0].zone = ZONES.play;

    //add 30 random cards to deck
    for (let i = 0; i < 30; i++) {
        let dice = Math.floor(Math.random()*(card_defs.length));
        let card = card_defs[dice];
        
        let structor = {
            [CARD_TYPES.minion]: Card.Minion,
            [CARD_TYPES.hero]: Card.Hero,
            [CARD_TYPES.weapon]: Card.Weapon,
            [CARD_TYPES.spell]: Card.Spell,
            [CARD_TYPES.power]: Card.Power,
            [CARD_TYPES.enchantment]: Card.Enchantment,
        }[card.type];
        
        let new_card = new structor(card, player, eventBus);
        // do we really need to couple deck & player ?
        deck.push(new_card);
    }

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

let progressOfCards = coolCards.reduce((a,v) => {
  let keys = Reflect.ownKeys(v);
  
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
function _progress () {
    console.log(`~~~~~~\n card implementation progress (of ${abilitiesMixin.length}):`, progressOfCards);  
    //card implementation progress (of 1206): { done: 41, in_progress: 7, not_started: 1110 }
}  
module.exports = {
    bootstrap,
    CardDefinitionsIndex,
    _progress
};