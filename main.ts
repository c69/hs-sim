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
  const g = initGame(
    ['Red', ['HERO_01']],
    ['Blue', ['HERO_02']]
  );
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
g_fatigue.end();

console.log('==================');

const state_definition_TAUNT_start = {
  game: { turn: 5 },
  p1: { active: true, mana: 5, manaCrystals: 7,
        minions: `3/10` },
  p2: { minions: `1/1+CHARGE, 1/1, 1/1, :CS2_125, 1/1, 1/1, 1/1` }
};

const state_definition_TAUNT_end = {
  p1: { minions: `3/7` },
  p2: { minions: `1/1+CHARGE, 1/1, 1/1, 1/1, 1/1, 1/1` }
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
// throw '!';

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
  //console.log(g.exportState());

  //g.usePower(0); // hero power first suggested target
  //g.playCard(0,0); // play first possible card at first target
  //g.attack(0,0); // attack with first suggested character first suggested target
  //g.viewState();
  //g.viewAvailableOptions();

  _ai_turn(g_visible, 75, true);

  console.log('___________________');
}
//console.log(g.exportState());

const results: any[] = [];
const _timeStart = Date.now();
for (let i = 0; i < NUMBER_OF_GAMES_IN_QUICK_RUN; i++) {
  // current speed is 100 games in 15 seconds
  // @ 09 Mar 2018 - current speed is 100 games in 5 seconds, node 9.7.1
  // @ 11 Jan 2018 - current speed is 100 games (1500 frames) in 3.5 sec, ts-node, node 11.6.0
  results.push(_quick_play(0, {mute: true}));
}
const duration_of_quick_run = ((Date.now()- _timeStart)/1000).toFixed(3);

const final_stats = results.reduce((a,v) => {
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
});
// speed max: 570 fps (2500 runs)
// speed avg: 350..400 fps (50..100 runs)
// speed min: 150..220 fps (1 run)
console.log(
`completed ${NUMBER_OF_GAMES_IN_QUICK_RUN} games in ${duration_of_quick_run}s.
 Speed ~ ${(final_stats.turns / Number(duration_of_quick_run)).toFixed(2)} fps`
);

_progress();
//card implementation progress (of 1206): { done: 41, in_progress: 7, not_started: 1110 }
//card implementation progress (of 1809): { done: 146, in_progress: 70, not_started: 1453 }

//debug output for performance testing
console.log(_GAME_profile());
//TODO: reimplement profiling for Board/selector (see board2.legacy.ts)
console.log( {
  // 'selectorsPerFrame': (b_profile._$_count / g_profile._frame_count_active).toFixed(3)
});
const {
  rss,
  heapTotal,
  heapUsed
} = process.memoryUsage();

const toMb = (n: number) => (n / (2 ** 20)).toFixed(2);
  console.log(
  {
    rss: toMb(rss), // 92
    heapTotal: toMb(heapTotal), // 70
    heapUsed: toMb(heapUsed), // 50
    stackAndCode: toMb(rss - heapTotal) // 13
  },
  process.cpuUsage()
);
