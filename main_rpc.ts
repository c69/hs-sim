/// <reference types="node" />

import { Board } from './classes/board5';
import {
  initGame,
  _GAME_profile
} from './classes/bootstrap';

let gameInstance = initGame(
  ['Alizee', ['HERO_08']],
  ['Sir Bob', ['HERO_01']]
);
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
  let g_profile = _GAME_profile();
  // let b_profile = Board._profile()
  console.log(g_profile);
  // console.log(b_profile);
  console.log( {
    // 'selectorsPerFrame': (b_profile._$_count / g_profile._frame_count_active).toFixed(3)
  });
}

module.exports = {
  //start: gameInstance.start.bind(gameInstance),
  exportState: gameInstance.exportState.bind(gameInstance),
  chooseOption: gameInstance.chooseOption.bind(gameInstance),
  showPerformance: showPerformance
};