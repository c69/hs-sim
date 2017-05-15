'use strict';
// @ts-check

const Hand = require('./hand.js');
const Hero = require('./hero.js');

class Player {
  constructor (deck, name) {
    this.deck = deck;
    this.hand = new Hand(this);
    this.name = name;
    this.hero = new Hero(this); // probably hero should be injected by Board ..
    this.fatigue = 1;
  }
  draw (n) {
    var newCards = this.deck.draw(n);
    if (!newCards.length) this.hero.dealDamage(this.fatigue++);
    newCards.forEach(card => (
      this.hand.add(card)
    ), this);
  }
  loose () {
    console.warn(`player ${this.name} LOST the game`);
  }
  _onLoose () {}
}

module.exports = Player;