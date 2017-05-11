'use strict';
// @ts-check

const Board = require('./board.js');

class Game {
  constructor (players) {
    if (players.length !== 2) throw new RangeError("Game expects two players");
    this.players = players;
    this.board = new Board(players[0], players[1]);
    this.turn = 0;
    this.activePlayer = this.players[this.turn % 2]; //this is a copypaste
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
  move () {
    // an action by player - card.play, weapon/self.attack, minion.attack, ability.do,
  }
  nextTurn () {
    this.players.forEach(player => {
      player.activeTurn = false;
    });
    if (this.isOver) return this;

    this.turn += 1;
    let activePlayer = this.players[this.turn % 2];
    this.activePlayer = activePlayer;
    if (activePlayer.manaCrystals < 10) {
      activePlayer.manaCrystals += 1;
    }
    activePlayer.mana = activePlayer.manaCrystals;
    activePlayer.draw(1);
    activePlayer.activeTurn = true; // maybe rename

    return this;
  }
  view () {
    console.log(`turn # ${this.turn}: ${this.activePlayer.name}`);
    this.players.forEach(player => {
      console.log(`
player:${player.name} hp:${player.hero.hp} mana:${player.mana}/${player.manaCrystals} deck:${player.deck.size} hand:${player.hand.size} ${player.hand.list().map(v=>v.name)}`
      );
      console.log('minions on board', this.board.listOwn(player).minions.map(v=>`(${v.attackPower}/${v.health})`));
    });
    
    return this;
  }
  finish () {
    this.isOver = true;
    //return this;
  }
  concede (player) {
    //..
    this.finish();
  }
}

module.exports = Game;