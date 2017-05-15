'use strict';
// @ts-check

const MAX_HAND_SIZE = 10;

class Hand {
  constructor (player) {
    this._hand = [];
    this.owner = player;
    let _card_id = 1;
    this.card_guid = () => (_card_id++);
  }
  view () {
    console.log(this._hand.map(({price, name}) => `(${price}) ${name}`).join(', '))
  }
  listPlayable () {
    //should also account for available targets.
    return this.list().filter(({price}) => price <= this.owner.mana);
  }
  list () {
    return this._hand.map((v) => {
      return {
        id: v.hand_id,
        name: v.name,
        type: v.type,
        price: v.price
      }
    });
  }
  /**
   * @param {number} card_id ID inside of this Hand
   * @returns {Function} actual card action
   */
  play (card_id) {
    if (!card_id) throw new RangeError('Card ID expected');
    //if (!this.owner.activeTurn) { <--------- move this to game.play or smwhere..
      //console.warn(`HH ${this.owner.name} cannot play card on other player's turn`);
      //return () => {};
    //}
    // add sanity check for if mana/cost changed but ID remains the same, etc
    let card_idx = this._hand.findIndex(v=>v.hand_id === card_id);
    if (card_idx < 0) return; 
    if (this._hand[card_idx].price > this.owner.mana) {
      console.warn(`hand.js ${this.owner.name} cannot play card ${this._hand[card_idx].name} - not enough mana`);
      return () => {};
    }
    let card = this._hand.splice(card_idx, 1)[0];
    this.owner.mana -= card.price;
    
    console.log(`hand.js::play ${this.owner.name} played `, card.name);
    return card.play;

    // what about targeting ?!
    // if card.isNeedTarget ? isNeedOptionalTarget ? isNeedTargetIfConditionMet ??? (-__-)
  }
  add (card) {
    if (this._hand.length >= MAX_HAND_SIZE) {
      return;
    } 
    card.hand_id = this.card_guid(); // add HAND_ID
    this._hand.push(card);

    return this;
  }
  get size () {
    return this._hand.length;
  }
}

module.exports = Hand;