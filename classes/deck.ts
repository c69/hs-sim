import {
  ZONES
} from '../data/constants';

export default class Deck {
  _arr: any[];
  constructor (arr: any[]) {
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
