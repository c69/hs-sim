/// <reference types="node" />

import {
  initGame,
  _GAME_profile
} from './classes/bootstrap';

const gameInstance = initGame(
  ['Alizee', ['HERO_08']],
  ['Sir Bob', ['HERO_01']]
);
gameInstance.start();

/** debug output for performance testing */
function showPerformance () {
  const g_profile = _GAME_profile();
  console.log(g_profile);
}

module.exports = {
  //start: gameInstance.start.bind(gameInstance),
  exportState: gameInstance.exportState.bind(gameInstance),
  chooseOption: gameInstance.chooseOption.bind(gameInstance),
  showPerformance: showPerformance
};
