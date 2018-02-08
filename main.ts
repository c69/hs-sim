/// <reference types="node" />

const EventEmitter = require('events');
class EventBus extends EventEmitter {
  // just in case if i decide to add helper methods..
}

const Game = require('./classes/game.js');
const Player = require('./classes/player.js');
const bootstrap2 = require('./classes/bootstrap.js');

const Board = require('./classes/board.js');
const {
  EVENTS
} = require('./data/constants.js');

const {
  bootstrap,
  _progress
} = require('./classes/cardUniverse.js');

/** Play with random actions */
function _quick_play (seed: number = 0, {mute}: {mute?: boolean}) {
  let _c = console.log;
  let _w = console.warn;
  if (mute) {
    console.log = function () {};
    console.warn = function () {};
  }
  // actual play
  let g = bootstrap2(['Red', 'HERO_01'], ['Blue', 'HERO_02']);
  g.start();
  //actual HS hardcoded maximum round is 87 or so..
  for(let i = 0; i < 90 && !g.isOver; i++) {
    //g.view();

    //g.usePower(0); // hero power first suggested target
    //g.playCard(0,0); // play first possible card at first target
    //g.attack(0,0); // attack with first suggested character first suggested target
    //g.viewState();
    //g.viewAvailableOptions();

    let max_actions_per_turn = 10;
    for (let actionCount = 0; actionCount < max_actions_per_turn; actionCount++) {
      let opts = g.viewAvailableOptions();
      //console.log(`XXX ${g2.activePlayer.name}'s options:`, opts);
      if (!opts.actions.length) break;
      g.chooseOption(opts.token); // just greedy do whatever you can (Hero is always first target, and attacks are free)
    }
    console.log('___________________');
    g.endTurn();
  }

  console.log = _c;
  console.warn = _w;
  //g.view();
  //console.log(`winner: ${g.result && g.result.winner.name} @turn #${g.turn}`);
  return {
    winner: g.result ? g.result.winner.name : 'UNFINISHED',
    turn: g.turn
  };
}
//---------------

let eventBus2 = new EventBus();
eventBus2.on(EVENTS.card_played, function (/*card*/) {
  //console.log(`EVT: card was played: ${card.name}`);
});
eventBus2.on(EVENTS.character_damaged, function (/*{target, amount}*/) {
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

for(let i = 0; i < 66 && !g_fatigue.isOver; i++) {
  g_fatigue.endTurn();
}
g_fatigue.view();

console.log('==================');

// bootstrap / init
// actual play
let g2 = new Game([dude1, dude2], eventBus2);
g2.start();

    //console.log('starting the game...333');
//AI - Artificial stupIdity
for(let i = 0; i < 13 && !g2.isOver; i++) {
  g2.view();
  //console.log(g2.exportState());

  //g.usePower(0); // hero power first suggested target
  //g.playCard(0,0); // play first possible card at first target
  //g.attack(0,0); // attack with first suggested character first suggested target
  //g.viewState();
  //g.viewAvailableOptions();

  let max_actions_per_turn = 10;
  for (let actionCount = 0; actionCount < max_actions_per_turn; actionCount++) {
    let opts = g2.viewAvailableOptions();
    //console.log(`XXX ${g2.activePlayer.name}'s options:`, opts);
    if (!opts.actions.length) break;
    g2.chooseOption(opts.token); // just greedy do whatever you can (Hero is always first target, and attacks are free)
  }

  console.log('___________________');
  g2.endTurn();
}
//console.log(g2.exportState());

let jjj = [];
let _timeStart = Date.now();
let _N_RUNS = 50;
for (let j = 0; j < _N_RUNS; j++) {
  // current speed is 100 games in 15 seconds
  jjj.push(_quick_play(0, {mute: true}));
}
let duration_of_quick_run = ((Date.now()- _timeStart)/1000).toFixed(3);

console.log(`completed ${_N_RUNS} games in ${duration_of_quick_run}s`);
console.log(jjj.reduce((a,v) => {
  let k = v.winner;
  if (!a[k]) a[k] = 0;
  a[k] += 1;

  a.turns += v.turn;
  if (a.longestGame < v.turn) a.longestGame = v.turn;
  if (a.shortestGame > v.turn) a.shortestGame = v.turn;

  return a;
}, {
  turns: 0,
  longestGame: 0,
  shortestGame: 100
} as {
  [key: string]: any;
}));

_progress();
//card implementation progress (of 1206): { done: 41, in_progress: 7, not_started: 1110 }

//debug output for performance testing
let g_profile = Game._profile();
let b_profile = Board._profile()
console.log(g_profile);
console.log(b_profile);
console.log( {
  'selectorsPerFrame': (b_profile._$_count / g_profile._frame_count_active).toFixed(3)
});
