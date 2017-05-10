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
  list () { // ??
    //return [this._board.get(this.player1), this._board.get(this.player2)];
    return this._board.values();
  }
  listOwn (player) {
    //this.removeDead(); // this is just a BUGGY hack, as we need to remove dead IMMEDIATELY after the move they die
    return this._board.get(player);
  }
  addOwn (player, minion) {
    var idx = 0;
    this._board.get(player).minions.splice(idx, 0, minion); //same bug
  }
  removeDead () {
    // silently remove dead minions
    //console.log(this.list());
    [...this.list()].forEach(v => {
      v.minions = v.minions.filter(m => m.hp > 0) 
    });
  }
} 

module.exports = Board;