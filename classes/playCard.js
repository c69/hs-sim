'use strict';

const {
  CARD_TYPES,
  EVENTS,
  ZONES
} = require('../data/constants.js');

function playFromHand (card, {game, $, target, position}) {
    if (!card) throw new RangeError('Card must be provided');
    //console.log(card);
    
    if (!card.owner === game.activePlayer) { 
        console.warn(`playCard: ${card.owner.name} cannot play card on other player's turn`);
        return () => {};
    }
    if (card.zone !== ZONES.hand) { 
        console.warn(`playCard: ${card.name} is not in hand, but rather in: ${card.zone}`);
        return () => {};
    } 
    if (card.cost > card.owner.mana) {
        console.warn(`playCard: cannot play card ${card.name} #${card.card_id} - not enough mana`);
        return () => {};
    };

    card.owner.mana -= card.cost;
    card._play();
    // temporary hack, while Hand still has its own array
    card.owner.hand._hand = card.owner.hand._hand.filter(v => !v === card);  
    
    console.log(`playCard: ${card.owner.name} played `, card.name);

    if (card.type === CARD_TYPES.minion) {
        // this.board.$('own minions').forEach((v,i) => {
        //   v.position = i;
        // });
        card.summon();//({position}); // position is IGNORED for now
        
        game.eventBus.emit(EVENTS.minion_summoned, {
            target: card
        });

        let _trigger_v1 = card.buffs.find(v => !!v.trigger); // should be .filter, as there could be more than one
        _trigger_v1 = _trigger_v1 && _trigger_v1.trigger;

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

    let r = card.play || function () {};
    //console.log('playCARD:', r);
    return r;
}

module.exports = playFromHand;