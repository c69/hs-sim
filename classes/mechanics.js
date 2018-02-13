'use strict';
// @ts-check

const {
    createCard,
    // CardDefinitionsIndex,
} = require('./cardUniverse.js');

const {
    // CARD_TYPES,
    TAGS_LIST,
    // EVENTS,
    // ZONES
} = require('../data/constants.js');

const {
    applyBuff
} = require('./buff.js');

/**
 * factory of bound helpers for use in abilty definitions
 */
function mechanics (card, game, $) {
    return {
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
        },
        buff (t, id_or_Tag) {
            if (!t) throw new RangeError('No target provided for buff');
            if (!id_or_Tag) throw new RangeError('No Buff/Tag provided');

            let targetArray = Array.isArray(t) ? t : [t];
            targetArray.forEach(v => {
                if (TAGS_LIST.includes(id_or_Tag)) {
                    v.buffs.push(id_or_Tag); // check for duplicates
                } else {
                    let enchantmentCard = createCard(id_or_Tag, card.owner, game.eventBus);

                    applyBuff({
                        card: enchantmentCard,
                        target: v,
                        $,
                        game
                    });
                }
            });
            return t;
        }
    }
}

module.exports = mechanics;