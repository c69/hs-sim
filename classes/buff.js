'use strict';
// @ts-check

const {
  //TAGS,
  TAGS_LIST,
  //CARD_TYPES,
  //ACTION_TYPES,
  //EVENTS
} = require('../data/constants.js');

//consider splitting this, to somehow simplify signature
/**
 * 
 * @param {Object} _options_
 *  .card - source?,
 *  .target,
 *  $,
 *  game,
 *  type = 'buff'|'aura'
 */
function applyBuff ({/* card or lambda-buff*/ card, target, $, game, type = 'buff'}) {
    //console.log(card);
    
    //console.log(target);
    //console.log(this.effect, '_______');
    let effect = card.effect || card;
    let attack_bonus = (typeof effect.attack !== 'function') ? effect.attack : effect.attack({target, $, game});

    let cost_modifier = typeof effect.cost === 'number' ? effect.cost : function (v, card) {
      return effect.cost(v, {target, $, game});    
    };

    let container = type === 'aura' ? target.incomingAuras : target.buffs;
    container.push({
        attack: attack_bonus,
        cost: cost_modifier,
        tags: effect.tags,

        //? zone: ??? -- is needed for Magma Giant 
        _by: card,
        toString () {
            return `[Object Buff: ${this._by.name} #${this._by.card_id}]`
        }  
    });

    //console.log(target.name, container);
    if (type === 'aura') {
        //console.log(`Aura refresh: ${this.name} on ${target.owner.name}'s ${target.name} by [source?]`);  
    } else {
        console.log(`${target.owner.name}'s ${target.name} got buffed with ${this.name}`);        
    }
}

/**
 * 
 * @param {Game} game  
 * @param {Function} $ Bound function
 * @param {Card} auraGiver 
 * @param {ArrayOfCards|Card} auraTarget 
 * @param {*} id_or_Tag
 * @returns {Object} auraTarget 
 */
function buffAura (game, $, auraGiver, auraTarget, id_or_Tag) {
    if (!auraTarget) throw new RangeError('No target provided for buff');
    if (!id_or_Tag) throw new RangeError('No Buff/Tag provided');

    let x2 = Array.isArray(auraTarget) ? auraTarget : [auraTarget]; 
    x2.forEach(v => {
      if (TAGS_LIST.includes(id_or_Tag)) {
        v.incomingAuras.push(id_or_Tag); // check for duplicates
        return;
      }
        
      let c = id_or_Tag;
      if (typeof id_or_Tag !== 'object') {
        c = createCard(id_or_Tag, auraGiver.owner, game.eventBus);
        c._play(); // unsafe ?
      } 
      applyBuff({
        card: c,
        target: v,
        $,
        game,
        type: 'aura'
      });
    });

    return auraTarget;
}

module.exports = {
    applyBuff,
    buffAura
};