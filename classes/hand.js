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
  play (card_id, game) {
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
      game.eventBus.emit(EVENTS.minion_summoned, {
        target: card
      });
  
      let _trigger_v1 = card.buffs.find(v => !!v.trigger); // should be .filter, as there could be more than one
      _trigger_v1 = _trigger_v1 && _trigger_v1.trigger;
      //if (card.name === 'Knife Juggler') console.log(card.buffs, _trigger_v1);

      if(_trigger_v1 && _trigger_v1.activeZone === 'play') {
        console.log(`hand.js: ${card.name} trigger ...`);
        // {
        //   activeZone: 'deck',
        //   eventName: 'summon',
        //   condition: 'own minion .race=pirate',
        //   action: ({summon, self}) => summon(self)         
        // }
        let event_name = _trigger_v1.eventName;
        let listener = function (evt) {
          let $ = game.board.$.bind(game.board, card.owner);
          let condition = _trigger_v1.condition;
          if (typeof condition === 'string' && ($(condition).findIndex(v => v === evt.target) === -1)) {
            return;
          } else if (typeof condition === 'function' && !condition({
            target: evt.target,
            self: card,
            $
          })) {
            return;
          }  
          console.log(`TRIGGER: action !active:${game.activePlayer.name} owner:${card.owner.name} ! ${event_name} [${card.name} #${card.card_id} @${card.zone}]`);
          _trigger_v1.action({
            target: evt.target,
            $,
            self: card,
            summon: function (ref_or_id) {
              console.log('TRIGGER: try to summon ', ref_or_id);
            },
            draw: function (n) {
              console.log(`TRIGGER: try to draw ${n}cards`);
              card.owner.draw(1);
            }
          });
        }.bind(game);
        game.eventBus.on(event_name, listener);
        console.log(`${card.name} is now listening to ${event_name}`);
        card._listener = [event_name, listener];
      } else {
        //console.log('Hand.js NO TRIGGERS in ', Reflect.ownKeys(card));
      }
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