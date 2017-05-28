"use strict";
// @ts-check

const EventEmitter = require('events');
class EventBus extends EventEmitter {
  // just in case if i decide to add helper methods..
}

const Game = require('./classes/game.js');
const Deck = require('./classes/deck.js');
const Player = require('./classes/player.js');

// from CardSelector
const CardJSON = require('./data/cards.all.generated.json');
const abilitiesMixin = require('./data/actions.collectible.js');
const Card = require('./classes/card.js');
//const Board = require('./classes/board.js');
const {
  CARD_TYPES: TYPES, // ! destructuring - so the renaming order is NON-OBVIOUS
  EVENTS
} = require('./data/constants.js');

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
    .filter(v => [TYPES.minion, TYPES.spell].includes(v.type))
    .filter(v => [
      //'Chillwind Yeti',
      //'River Crocolisk',
      //'Bloodfen Raptor',
//--spells:damage
//      'Fireball',
      //'Arcane Explosion',
      //'Arcane Missiles',
//      'Hellfire',
      //'Swipe',

//--basic minions with tags or battlecries
      //'Flame Imp',
      //'Ironfur Grizzly',
      'Ironbeak Owl',
      //'Leper Gnome',
      'Unstable Ghoul',
      //'Abomination',
      // 'Elven Archer',
      //'Silent Knight', //-- stealth
      //'Annoy-o-Tron',
      //'Shielded Minibot',
      // 'Argent Horseraider',
      //'Young Dragonhawk',
      // 'Thrallmar Farseer',
      
//--summon
      //'Murloc Tidehunter',
      //'Leeroy Jenkins',
      //'Mirror Image',

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
    

console.log('initializing players');

//facepalm - quantum entanglement =_=    
// - atm - player depends on deck depends on list of cards depends on owner = player (!) cirular
//todo: split
let deck1 = [];
let deck2 = [];
let dude1 = new Player('Alice');
let dude2 = new Player('Bob');
dude1.deck = new Deck(deck1);
dude2.deck = new Deck(deck2);

let eventBus2 = new EventBus();
eventBus2.on(EVENTS.card_played, function (card) {
  //console.log(`EVT: card was played: ${card.name}`);
});
eventBus2.on(EVENTS.character_damaged, function ({target, amount}) {
  //console.log(`EVT: ${target.name} was damaged for ${amount}`);
});

[[deck1, dude1, 'HERO_08'], [deck2, dude2, 'HERO_01']].forEach(([deck, player, hero_id]) => {
    //console.log(deck, player);
    try {
      deck.push(new Card.Hero(CardDefinitionsIndex[hero_id], player, eventBus2));
      deck[0].zone = 'PLAY';
      for (let i = 0; i < 30; i++) {
          let dice = Math.floor(Math.random()*(card_defs.length));
          let card = card_defs[dice];
          
          let structor = {
              [TYPES.minion]: Card.Minion,
              [TYPES.hero]: Card.Hero,
              [TYPES.weapon]: Card.Weapon,
              [TYPES.spell]: Card.Spell,
              [TYPES.power]: Card.Power,
              [TYPES.enchantment]: Card.Enchantment,
          }[card.type];
          deck.push(new structor(card, player, eventBus2)); // do we really need to couple deck & player ?
      }
    } catch (err) {
      console.warn(err);
    }
});
console.log('bootstrap finished');

//e2e test for Fatigue
let eb1 = new EventBus();
let lazy1 = new Player('Lazy1');
let lazy2 = new Player('Lazy2');
lazy1.deck = new Deck([
  new Card.Hero(CardDefinitionsIndex['HERO_09'], lazy1, eb1)
]);
lazy2.deck = new Deck([
  new Card.Hero(CardDefinitionsIndex['HERO_07'], lazy2, eb1)  
]);
lazy1.deck._arr[0].zone = 'PLAY';
lazy2.deck._arr[0].zone = 'PLAY';

var g_fatigue = new Game([
  lazy1,
  lazy2  
], eb1);
g_fatigue.start();
try {

for(let i = 0; i < 66 && !g_fatigue.isOver; i++) {
  g_fatigue.endTurn();
}
g_fatigue.view();

} catch(err) {console.log(err)}
console.log('==================');

// bootstrap / init
try {

// actual play
let g2 = new Game([dude1, dude2], eventBus2);
g2.start();

    //console.log('starting the game...333');
//AI - Artificial stupIdity
for(let i = 0; i < 13 && !g2.isOver; i++) {
  g2.view();

  //g.usePower(0); // hero power first suggested target
  //g.playCard(0,0); // play first possible card at first target
  //g.attack(0,0); // attack with first suggested character first suggested target
  //g.viewState();
  //g.viewAvailableOptions();

  let max_actions_per_turn = 10;
  for (let i = 0; i < max_actions_per_turn; i++) {
    let opts = g2.viewAvailableOptions();
    //console.log(`XXX ${g2.activePlayer.name}'s options:`, opts);
    if (!opts.actions.length) break;
    g2.chooseOption(); // just greedy do whatever you can (Hero is always first target, and attacks are free)
  }
  
  console.log('___________________');
  g2.endTurn();
}
} catch (err) {console.warn(err)}