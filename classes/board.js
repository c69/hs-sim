'use strict';
// @ts-check

class Board {
  constructor (player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this._board = new Map([[
      player1, {
        hero: player1.hero,
        minions: []
      }],[
      player2, {
        hero: player2.hero,
        minions: []
    }]]);
  }
  list () { // ??
    return [this._board.get(this.player1), this._board.get(this.player2)];
  }
  listOwn (player) {
    return this._board.get(player);
  }
  addOwn (player, minion) {
    var idx = 0;
    this._board.get(player).minions.splice(idx, 0, minion); //same bug
  }
  remove () {

  }
} 

module.exports = Board;