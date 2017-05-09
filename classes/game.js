'use strict';
// @ts-check

const Board = require('./board.js');

class Game {
  constructor (players) {
    this.players = players;
    //this.board = new Board(...players);
    this.board = new Board(players[0], players[1]); // make tsc happy
    this.turn = 0;
  }
  start () {
    this.isOver = false;
    this.players.forEach(player => {
      player._onLoose = function () {
        this.finish(player);
      }.bind(this);
      player.draw(5);
      player.manaCrystals = 1;
      player.mana = player.manaCrystals;
      player.board = this.board;// temporary hack - wiring
    });

    return this;  
  }
  nextTurn () {
    if (this.isOver) return this;

    this.turn += 1;
    let player = this.players[this.turn % 2];
    if (player.manaCrystals < 10) {
      player.manaCrystals += 1;
    }
    player.mana = player.manaCrystals;
    player.draw(1);
  
    return this;
  }
  view () {
    console.log(`turn # ${this.turn}`);
    this.players.forEach(player => {
      console.log(`
player:${player.name} hp:${player.hero.hp} mana:${player.mana}/${player.manaCrystals}
hand:${player.hand.size} ${player.hand.list().map(v=>v.name)}`
      );
      console.log('minions on board', this.board.listOwn(player).minions.map(v=>v.name));
    });
    
    return this;
  }
  finish () {
    this.isOver = true;
    //return this;
  }
}

module.exports = Game;