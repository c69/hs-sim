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
  
  attack (attacker, target) {
    if (!target) return;
    if (target.health < 1) return;
    if (attacker.health < 1) return;
    if (!attacker.owner.activeTurn) return; // is there a way to attack on enemy turn ? - UNGORO:WarriorLegendDino(8)
    if (target.owner === attacker.owner) return; // will fail for Hunter:Misdirection secret, and Ogres
    console.log(`⚔️ ${attacker.name}(${attacker.attackPower}/${attacker.health}) attacks ${target.name}(${target.attackPower}/${target.health})`);
    //console.log(`🛡️ ${attacker.name} attacks ${target.name}(${target.attackPower}/${target.health})`);
    //ignore shields, etc for now
    target.health -= attacker.attackPower;
    attacker.health -= target.attackPower;  
    target.isStillAlive();
    attacker.isStillAlive();  
  }

  nextTurn () {
    this.players.forEach(player => {
      player.activeTurn = false;
    });
    if (this.isOver) return this;

    this.turn += 1;
    let activePlayer = this.players[this.turn % 2];
    this.activePlayer = activePlayer;
    activePlayer.activeTurn = true; // maybe rename
    if (activePlayer.manaCrystals < 10) {
      activePlayer.manaCrystals += 1;
    }
    if (activePlayer.mana < 0) throw `Unexpected state: player ${activePlayer.name} has negative mana:${activePlayer.mana}, check code for bugs!`;
    activePlayer.mana = activePlayer.manaCrystals;
    
    activePlayer.draw(1);

    return this;
  }
  view () {
    console.log(`turn # ${this.turn}: ${this.activePlayer.name}`);
    this.players.forEach(player => {
      console.log(`
player:${player.name} hp❤️:${player.hero.hp} mana💎:${player.mana}/${player.manaCrystals} deck:${player.deck.size} hand:${player.hand.size} ${player.hand.list().map(v=>v.name)}`
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