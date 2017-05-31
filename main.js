"use strict";
// @ts-check

const EventEmitter = require('events');
class EventBus extends EventEmitter {
  // just in case if i decide to add helper methods..
}

const Game = require('./classes/game.js');
const Deck = require('./classes/deck.js');
const Player = require('./classes/player.js');

 const Card = require('./classes/card.js');
//const Board = require('./classes/board.js');
const {
  CARD_TYPES: TYPES, // ! destructuring - so the renaming order is NON-OBVIOUS
  EVENTS,
  ZONES
} = require('./data/constants.js');

const {
  bootstrap,
  CardDefinitionsIndex,
  _progress
} = require('./classes/cardUniverse.js');

//---Deck2.js sketch------------------
// let card_defs = CardDefinitions.filter(v => v.collectible === true)
//     .filter(v => [TYPES.minion, TYPES.spell].includes(v.type))
//     .filter(v => [
//       //'Chillwind Yeti',
//       //'River Crocolisk',
//       //'Bloodfen Raptor',
// //--spells:damage
// //      'Fireball',
//       'Arcane Explosion',
//       //'Arcane Missiles',
// //      'Hellfire',
//       'Swipe',

// //--basic minions with tags or battlecries
//       'Flame Imp',
//       //'Ironfur Grizzly',
//       'Ironbeak Owl',
//       //'Leper Gnome',
//       'Unstable Ghoul',
//       //'Abomination',
//       'Elven Archer',
//       //'Silent Knight', //-- stealth
//       //'Annoy-o-Tron',
//       //'Shielded Minibot',
//       // 'Argent Horseraider',
//       //'Young Dragonhawk',
//       // 'Thrallmar Farseer',
      
// //--summon
//       'Murloc Tidehunter',
//       //'Leeroy Jenkins',
//       'Mirror Image',

// //--trigger, MVP minions
//       'Knife Juggler',
//       'Acolyte of Pain',
//       //'Imp Gang Boss',
//       'Starving Buzzard',
//       //'Patches the Pirate',
//       //'Doomsayer',
//       //'Grim Patron',

//     ].includes(v.name))
//     ;

let eventBus2 = new EventBus();
eventBus2.on(EVENTS.card_played, function (card) {
  //console.log(`EVT: card was played: ${card.name}`);
});
eventBus2.on(EVENTS.character_damaged, function ({target, amount}) {
  //console.log(`EVT: ${target.name} was damaged for ${amount}`);
});
console.log('initializing players');
let dude1 = new Player('Alice');
let dude2 = new Player('Bob');
bootstrap(
  //[new Player('Alice'), 'HERO_08', [1,2,3]],
  //[new Player('Bob'), 'HERO_01', []],
  [dude1, 'HERO_08', []],
  [dude2, 'HERO_01', []],
  eventBus2
);
console.log('bootstrap for game 2 finished');

//e2e test for Fatigue
let eb1 = new EventBus();
let lazy1 = new Player('Lazy1');
let lazy2 = new Player('Lazy2');

bootstrap(
  [lazy1, 'HERO_09', []],
  [lazy2, 'HERO_07', []],
  eb1
);
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

_progress();
//card implementation progress (of 1206): { done: 41, in_progress: 7, not_started: 1110 }
} catch (err) {console.warn(err)}