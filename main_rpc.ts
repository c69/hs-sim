/// <reference types="node" />

import {
  initGame,
  _GAME_profile
} from './classes/bootstrap';

let gameInstance = initGame(
  ['Alizee', ['HERO_08']],
  ['Sir Bob', ['HERO_01']]
);
gameInstance.start();


/** debug output for performance testing */
function showPerformance () {
  let g_profile = _GAME_profile();
  console.log(g_profile);
}

module.exports = {
  //start: gameInstance.start.bind(gameInstance),
  exportState: gameInstance.exportState,
  chooseOption: gameInstance.chooseOption,
  showPerformance: showPerformance
};
