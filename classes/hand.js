'use strict';
// @ts-check

class Hand {
  constructor (player) {
    this._hand = [];
    this.owner = player;
  }
  view () {
    console.log(this._hand.map(({price, name}) => `(${price}) ${name}`).join(', '))
  }
  listPlayable () {
    return this.list().filter(({price}) => price <= this.owner.mana);
  }
  list () {
    return this._hand.map((v,i) => {
      return {
        id: i, // consider a harder proof, like autoincrement
        name: v.name,
        type: v.type,
        price: v.price
      }
    });
  }
  play (card_idx) {
    if (!this.owner.activeTurn) {
      console.warn(`HH ${this.owner.name} cannot play card on other player's turn`);
      return () => {};
    }
    // add sanity check for if mana/cost changed but ID remains the same, etc
    var card = this._hand.splice(card_idx, 1)[0];
    this.owner.mana -= card.price;
    console.log(`HH ${this.owner.name} played `, card.name);
    return card.action;

    // what about targeting ?!
    // if card.isNeedTarget ? isNeedOptionalTarget ? isNeedTargetIfConditionMet ??? (-__-)
  }
  add (card) {
    if (this._hand.length > 9) {
      return;
    } 
    this._hand.push(card);
  }
  get size () {
    return this._hand.length;
  }
}

module.exports = Hand;