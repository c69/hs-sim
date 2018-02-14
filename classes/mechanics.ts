import {
    createCard,
    // CardDefinitionsIndex,
} from './cardUniverse';

import {
    // CARD_TYPES,
    TAGS_LIST,
    // EVENTS,
    // ZONES
} from '../data/constants2';

import {
    applyBuff
} from './buff';

/**
 * factory of bound helpers for use in abilty definitions
 */
export default function mechanics (card, game, $) {
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
