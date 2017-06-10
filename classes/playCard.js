'use strict';

const {
    createCard,
    bootstrap,
    CardDefinitionsIndex,
    _progress
} = require('./cardUniverse.js');

const {
    CARD_TYPES,
    TAGS_LIST,
    EVENTS,
    ZONES
} = require('../data/constants.js');

const {
    applyBuff
} = require('./buff.js');


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
        card._summon();//({position}); // position is IGNORED for now
        

        let _trigger_v1 = card.buffs.find(v => !!v.trigger); // should be .filter, as there could be more than one
        _trigger_v1 = _trigger_v1 && _trigger_v1.trigger;

        if(_trigger_v1 && _trigger_v1.activeZone === 'play') {
            console.log(`playCard.js: ${card.name} trigger ...`);
            // {
            //   activeZone: 'deck',
            //   eventName: 'summon',
            //   condition: 'own minion .race=pirate',
            //   action: ({summon, self}) => summon(self)         
            // }
            let event_name = _trigger_v1.eventName;
            let listener = function (evt) {
                let $ = game._$.get(card.owner);
                let condition = _trigger_v1.condition;
                if (condition === 'self') {
                    // proceed
                } else if (typeof condition === 'string' && ($(condition).findIndex(v => v === evt.target) === -1)) {
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
                    self: card,
                    target: evt.target,
                    $,
                    game,
                    summon (id) {
                        console.log(`TRIGGER.summon: Summoning ${id}`);
                        if ($('own minion').length >= 7) return;

                        let MY_CREATION = createCard(id, card.owner, game.eventBus);
                        card.owner.deck._arr.push(MY_CREATION);
                        MY_CREATION._summon();
                        //console.log('its real!!!', MY_CREATION);
                    },
                    draw (n) {
                        console.log(`TRIGGER: try to draw ${n}cards`);
                        card.owner.draw(n);
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

    //console.log('playCARD:', card.play
    if (!card.play) {
        if (card.type === CARD_TYPES.spell) {
          throw `Spell ${card.name} has no action!`
        } 
        //console.log('no battlecry. no problem :)')  
        return;
    }
    //only execute battlecry/spell_text if there is a valid target, or it does not require a target
    if (target && !card.target) {     
      console.log('no battle, no cry...', target, card.target);  
      throw 'unexpected target for card which does not need it';
    }
    if (!target && card.target) {
        if (card.type === CARD_TYPES.spell) {
            console.log('no battle, no cry...', target, card.target);  
            throw 'spell which require target, MUST have target';
        } else {
            //console.log('no valid target for battlecry. no problem :)')
            return;
        }
    }
    card.play({
        self: card,  
        target,
        position,
        $: $,
        game: this,
        summon (id) {
            console.log(`cardPlay.summon: Summonning ${id}`);
            if ($('own minion').length >= 7) return;

            let MY_CREATION = createCard(id, card.owner, game.eventBus);
            card.owner.deck._arr.push(MY_CREATION);
            MY_CREATION._summon();
            //console.log('its real!!!', MY_CREATION);
        },
        draw (n) {
            console.log(`PLAY: try to draw ${n}cards`);
            card.owner.draw(n);
        },
        buff (x, id_or_Tag) {
            if (!x) throw new RangeError('No target provided for buff');
            if (!id_or_Tag) throw new RangeError('No Buff/Tag provided');

            let x2 = Array.isArray(x) ? x : [x]; 
            x2.forEach(v => {
                if (TAGS_LIST.includes(id_or_Tag)) {
                    v.buffs.push(id_or_Tag); // check for duplicates
                } else {
                    let ccc = createCard(id_or_Tag, card.owner, game.eventBus);

                    applyBuff({card: ccc, target: v, $, game});
                }
            });
            return x;
        }
    });
}

module.exports = playFromHand;