'use strict';
// @ts-check

class Board {
  constructor (player1, player2) {
    //this.player1 = player1;
    //this.player2 = player2;
    this._board = new Map(
      [player1, player2].map(player => ([player, {
        hero: player.hero,
        minions: []
      }]))
    );
  }
  listOwnAll (player) {
    return this._board.get(player);
  }
  /** Returns current hero and alive minions for player */
  listOwn (player) {
    //let enemyPlayer = [...this._board.keys()].filter(v => v !== player);
    let {hero, minions} = this._board.get(player);
        return {
      hero,
      minions: minions.filter(v => v.health > 0)
    }
  }
  listEnemy (player) {
    let {hero, minions} = this._board.get(player);
    return {
      hero,
      minions: minions.filter(v => v.health > 0)
    }
  }
  addOwn (player, minion) {
    let idx = 0;
    let m = this._board.get(player).minions;
    if (m.length > 6) return;
    m.splice(idx, 0, minion);
  }
} 

module.exports = Board;