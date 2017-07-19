'use strict';
// @ts-check

const {
  CARD_TYPES,
  EVENTS
} = require('../data/constants.js');

const MAX_HAND_SIZE = 10;

class Hand {
  constructor (player) {
    this._hand = [];
    this.owner = player;
  }
  // get _hand () {
  //   return this._arr.filter(v => v.zone === ZONES.hand);
  // }
  view () {
    console.log(this._hand.map(({cost, name}) => `(${cost}) ${name}`).join(', '))
  }
  listPlayable () {
    //should also account for available targets.
    return this.list().filter(({cost}) => cost <= this.owner.mana);
  }
  list () {
    return this._hand.map(v => v);
  }

  add (card) {
    if (this._hand.length >= MAX_HAND_SIZE) {
      return this;
    } 
    this._hand.push(card);

    return this;
  }
  get size () {
    return this._hand.length;
  }
}

module.exports = Hand;