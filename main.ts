/// <reference types="node" />

import {
  initGame,
  _GAME_profile
} from './classes/bootstrap';
import {
  _progress
} from './classes/cardUniverse';
import { GameLoop } from './classes/gameLoop';

const NUMBER_OF_GAMES_IN_QUICK_RUN = process.argv[2] || 50;

function _ai_turn (
  game: GameLoop,
  max_actions_per_turn = 25,
  exportState = false
) {
  for (let actionCount = 0; actionCount < max_actions_per_turn; actionCount++) {
    const opts = game.viewAvailableOptions();

    if (exportState) game.exportState(); // verify JSON export is working

    //console.log(`XXX ${g2.activePlayer.name}'s options:`, opts);
    if (opts.actions.length < 3) {
      game.chooseOption(opts.token);
      break; // = [end_turn, concede]
    }
    game.chooseOption(opts.token); // just greedy do whatever you can (Hero is always first target, and attacks are free)
  }
}

/** Play with random actions */
function _quick_play (seed: number = 0, {mute}: {mute?: boolean}) {
  const _c = console.log;
  const _w = console.warn;
  if (mute) {
    console.log = () => void(0);
    console.warn = () => void(0);
  }
  // actual play
  const g = initGame(['Red', ['HERO_01']], ['Blue', ['HERO_02']]);
  g.start();
  //actual HS hardcoded maximum round is 87 or so..
  for(let i = 0; i < 90 && !g.isOver; i++) {
    //g.view();

    //g.usePower(0); // hero power first suggested target
    //g.playCard(0,0); // play first possible card at first target
    //g.attack(0,0); // attack with first suggested character first suggested target
    //g.viewState();
    //g.viewAvailableOptions();

    _ai_turn(g, 10);
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

//e2e test for Fatigue
const g_fatigue = initGame(
  ['Lazy1', ['HERO_09']],
  ['Lazy', ['HERO_07']]
);
g_fatigue.start();

for(let i = 0; i < 66 && !g_fatigue.isOver; i++) {
  g_fatigue.endTurn();
}
g_fatigue.view();

console.log('==================');

const state_definition_TAUNT_start = {
  game: { turn: 5 },
  p1: { active: true, mana: 5, manaCrystals: 7,
        minions: `1/10` },
  p2: { minions: `1/1, 1/1, 1/1, 5/1+TAUNT, 1/1, 1/1, 1/1` }
};

const state_definition_TAUNT_end = {
  p1: { minions: `1/5` },
  p2: { minions: `1/1, 1/1, 1/1, 1/1, 1/1, 1/1` }
};

const g_parse1 = initGame(
  ['Alice', ['HERO_08']],
  ['Bob', ['HERO_01']],
  state_definition_TAUNT_start
);
g_parse1.start();
// console.log(g_parse1.viewState());
g_parse1.view();
g_parse1.chooseOption();
g_parse1.view();
console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

// bootstrap / init
// actual play
const g_visible = initGame(
  ['Alice', ['HERO_08']],
  ['Bob', ['HERO_01']]
);
g_visible.start();

    //console.log('starting the game...333');
//AI - Artificial stupIdity
for(let i = 0; i < 13 && !g_visible.isOver; i++) {
  g_visible.view();
  //console.log(g2.exportState());

  //g.usePower(0); // hero power first suggested target
  //g.playCard(0,0); // play first possible card at first target
  //g.attack(0,0); // attack with first suggested character first suggested target
  //g.viewState();
  //g.viewAvailableOptions();

  _ai_turn(g_visible, 75, true);

  console.log('___________________');
}
//console.log(g2.exportState());

const results: any[] = [];
const _timeStart = Date.now();
for (let i = 0; i < NUMBER_OF_GAMES_IN_QUICK_RUN; i++) {
  // current speed is 100 games in 15 seconds
  // @ 09 Mar 2018 - current speed is 100 games in 5 seconds, node 9.7.1
  // @ 11 Jan 2018 - current speed is 100 games (1500 frames) in 3.5 sec, ts-node, node 11.6.0
  results.push(_quick_play(0, {mute: true}));
}
const duration_of_quick_run = ((Date.now()- _timeStart)/1000).toFixed(3);

console.log(`completed ${NUMBER_OF_GAMES_IN_QUICK_RUN} games in ${duration_of_quick_run}s`);
console.log(results.reduce((a,v) => {
  const k = v.winner;
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
const g_profile = _GAME_profile();
// let b_profile = Board._profile()
console.log(g_profile);
// console.log(b_profile);
console.log( {
  // 'selectorsPerFrame': (b_profile._$_count / g_profile._frame_count_active).toFixed(3)
});
console.log(process.memoryUsage(), process.cpuUsage());
