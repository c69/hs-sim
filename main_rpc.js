"use strict";
// @ts-check

const EventEmitter = require('events');
class EventBus extends EventEmitter {
  // just in case if i decide to add helper methods..
}

const Game = require('./classes/game.js');
const Player = require('./classes/player.js');

const Board = require('./classes/board.js');
// const {
//   EVENTS,
// } = require('./data/constants.js');

const {
  bootstrap,
} = require('./classes/bootstrap.js');

let eventBus = new EventBus();
// eventBus.on(EVENTS.card_played, function (card) {
//   console.log(`EVT: card was played: ${card.name}`);
// });
// eventBus.on(EVENTS.character_damaged, function ({target, amount}) {
//   console.log(`EVT: ${target.name} was damaged for ${amount}`);
// });
console.log('initializing players');
let dude1 = new Player('Alice');
let dude2 = new Player('Bob');
bootstrap(
  //[new Player('Alice'), 'HERO_08', [1,2,3]],
  //[new Player('Bob'), 'HERO_01', []],
  [dude1, 'HERO_08', []],
  [dude2, 'HERO_01', []],
  eventBus
);
console.log('bootstrap for game 2 finished');


// bootstrap / init
// actual play
let gameInstance = new Game([dude1, dude2], eventBus);

gameInstance.start();

// let gameLoop = function* () {
//   for(let i = 0; i < 87 && !gameInstance.isOver; i++) {
    //g2.view();
    //g2.exportState();

    //g.usePower(0); // hero power first suggested target
    //g.playCard(0,0); // play first possible card at first target
    //g.attack(0,0); // attack with first suggested character first suggested target
    //g.viewState();
    //g.viewAvailableOptions();

//     let max_actions_per_turn = 10; //legacy safeguard, - remove when its not needed
//     for (let i = 0; i < max_actions_per_turn; i++) {
//       let opts = gameInstance.viewAvailableOptions();
//       //console.log(`XXX ${g2.activePlayer.name}'s options:`, opts);
//       if (!opts.actions.length) break;
//       gameInstance.chooseOption(opts.token);
//     }

//     console.log('___________________');
//     gameInstance.endTurn();
//   }
// }
//_progress();
//card implementation progress (of 1206): { done: 41, in_progress: 7, not_started: 1110 }

/** debug output for performance testing */
function showPerformance () {
  let g_profile = Game._profile();
  let b_profile = Board._profile()
  console.log(g_profile);
  console.log(b_profile);
  console.log( {
    'selectorsPerFrame': (b_profile._$_count / g_profile._frame_count_active).toFixed(3)
  });
}

module.exports = {
  //start: gameInstance.start.bind(gameInstance),
  exportState: gameInstance.exportState.bind(gameInstance),
  chooseOption: gameInstance.chooseOption.bind(gameInstance),
  showPerformance: showPerformance
};
