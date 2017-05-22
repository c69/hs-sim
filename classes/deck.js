'use strict';
// @ts-check

class Deck {
  constructor (arr) {
    this._arr = arr; // direct mutable reference +_+ !
  }
  draw (n = 1) {
    var result = [];
    while (n > 0) {
      var card = this._deck[0];
      
      if (card) {
       //console.log('card drawn from', card.zone, card);
       card.zone = 'HAND';
       result.push(card);
      }
      n--;
    }
    return result;
  }
  get _deck () {
    return this._arr.filter(v => v.zone === 'DECK');
  }
  get size () {
    return this._deck.length;
  }
}

module.exports = Deck;
