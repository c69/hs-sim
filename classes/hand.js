'use strict';
// @ts-check

const CARD_TYPES = require('../data/constants.js').CARD_TYPES;


const MAX_HAND_SIZE = 10;

class Hand {
  constructor (player) {
    this._hand = [];
    this.owner = player;
    let _card_id = 1;
    this.card_guid = () => (_card_id++);
  }
  view () {
    console.log(this._hand.map(({cost, name}) => `(${cost}) ${name}`).join(', '))
  }
  listPlayable () {
    //should also account for available targets.
    return this.list().filter(({cost}) => cost <= this.owner.mana);
  }
  list () {
    return this._hand.map((v) => {
      return {
        id: v.hand_id,
        name: v.name,
        type: v.type,
        cost: v.cost,
        target: v.target
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
    if (this._hand[card_idx].cost > this.owner.mana) {
      console.warn(`hand.js ${this.owner.name} cannot play card ${this._hand[card_idx].name} - not enough mana`);
      return () => {};
    }
    let card = this._hand.splice(card_idx, 1)[0];
    this.owner.mana -= card.cost;
    
    console.log(`hand.js::play ${this.owner.name} played `, card.name);
    
    if (card.type === CARD_TYPES.minion) {
      // this.board.$('own minions').forEach((v,i) => {
      //   v.position = i;
      // });
      //console.log(c);
      //console.log(card);
      card.summon();//({position}); // position is IGNORED for now
    }
    
    return card.play || function () {};

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