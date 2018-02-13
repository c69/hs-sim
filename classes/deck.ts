const {
  ZONES
} = require('../data/constants.js');

export default class Deck {
  constructor (arr) {
    this._arr = arr; // direct mutable reference +_+ !
  }
  draw (n = 1) {
    var result = [];
    while (n > 0) {
      var card = this._deck[0];

      if (card) {
       card._draw();
       result.push(card);
      }
      n--;
    }
    return result;
  }
  get _deck () {
    return this._arr.filter(v => v.zone === ZONES.deck);
  }
  get size () {
    return this._deck.length;
  }
}
