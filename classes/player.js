'use strict';
// @ts-check

const {
  CARD_TYPES,
  ZONES
} = require('../data/constants.js');

const Hand = require('./hand.js');

class Player {
  constructor (name) {
    this.name = name;
    
    this.deck = null;//deck; //$('own @deck');
    this.hand = new Hand(this); //$('own @hand');
    
    this.fatigue = 1;
  }
  get hero () {
    //console.log('trying to GET .hero from Player ' + this.name);
    let r = this.deck._arr.find(v => v.type === CARD_TYPES.hero && v.zone === ZONES.play); // probably hero should be injected by Board ..
    //console.log(r);
    return r || this.deck._arr.find(v => v.type === CARD_TYPES.hero && v.zone === ZONES.grave);
  }
  draw (n) {
    console.log(`player ${this.name} draws a card.. (of ${this.deck.size} remaining)`);
    var newCards = this.deck.draw(n);
    if (!newCards.length) this.hero.dealDamage(this.fatigue++);
    
    newCards.forEach(card => (
      this.hand.add(card)
    ), this);
  }
  loose () {
    console.warn(`player ${this.name} LOST the game`);
    this.lost = true;
  }
}

module.exports = Player;