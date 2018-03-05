import {
  //TAGS,
  TAGS_LIST,
  CARD_TYPES,
  //ACTION_TYPES,
  //EVENTS
} from '../data/constants';

import {
  createCard // temporary - test that summoning from Deathratlle works
} from './cardUniverse';

import { MapString } from '../shared.interface';

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
function applyBuff ({
  /* card or lambda-buff*/
  card,
  target,
  $,
  board,
  game,
  type = 'buff'
}) {
    //console.log(card);
    if (!card) throw 'empty buff';
    if (!card.type && !card.effects) throw `invalid argument - lambda buff of unknown shape: ${JSON.stringify(card)}`;
    //if (!card.type && card.effects) throw `lambda buffs are forbidden: ${Object.keys(card.effects).map (v => `\n- ${v}  ${card.effects[v].toString()}`)}`;

    if (card.type === CARD_TYPES.enchantment && !card.effects) throw 'invalid enchantment';
    if (card.type && card.type !== CARD_TYPES.enchantment) throw `attempt to buff with card of type: ${card.type}`;


    //console.log(target);
    //console.log(this.effect, '_______');
    let effect = card.effects || card;
    if (!effect) throw 'empty effect';
    //console.log(effect);

    let attack_modifier = (({
      'number': effect.attack,
      'function': function (v, card) {
        return effect.attack(v, {target, $, game});
     }
    } as MapString<(a: number, b: any ) => number>)[typeof effect.attack]);

    let cost_modifier = (({
      'number': effect.cost,
      'function': function (v, card) {
        return effect.cost(v, {target, $, game});
      }
    } as MapString<(a: number, b: any ) => number>)[typeof effect.cost]);

    // making health work the same way as attack or cost is hard
    // - because it is being mutated by damage
    // - and it does not use getter yet (and maybe should not)
    // let health_modifier;

    //here we directly modify the target.incomingAuras or target.buffs
    // watch out for bugs (-_-)
    let container = type === 'aura' ? target.incomingAuras : target.buffs;
    container.push({
        effects: Object.assign(
            {},
            {attack: attack_modifier},
            // NOT_IMPLEMENTED {health: health_modifier},
            {cost: cost_modifier}
        ),
        tags: (effect.tags || []).slice(0),

        _by: card,
        toString () {
            return `[Object Buff: ${this._by.name} #${this._by.card_id}]`
        }
    });

    //console.log(target.name, container);
    if (type === 'aura') {
        //console.log(`Aura refresh: ${this.name} on ${target.owner.name}'s ${target.name} by [source?]`);
    } else {
        console.log(`${target.owner.name}'s ${target.name} got buffed with ${card.name}`);
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
function buffAura (game, $, board, auraGiver, auraTarget, id_or_Tag) {
    if (!auraTarget) throw new RangeError('No target provided for buff');
    if (!id_or_Tag) throw new RangeError('No Buff/Tag provided');

    let auraTargetList = Array.isArray(auraTarget) ? auraTarget : [auraTarget];
    auraTargetList.forEach(t => {
      if (TAGS_LIST.includes(id_or_Tag)) {
        t.incomingAuras.push(id_or_Tag); // check for duplicates
        return;
      }

      let c = id_or_Tag;
      if (typeof id_or_Tag !== 'object') {
        c = createCard(id_or_Tag, auraGiver.owner, game.eventBus);
        board.add(c);
        // ... no no no no
        // again the "put in the game" and "play from hand are mixed" :(
        // aura and buff need "put in play" (from ouside)
        board._playFromHand(c); // unsafe ? where is the destructor ? TODO: check for leaks
      }
      applyBuff({
        card: c,
        target: t,
        $,
        board,
        game,
        type: 'aura'
      });
    });

    return auraTarget;
}

export {
    applyBuff,
    buffAura
};
