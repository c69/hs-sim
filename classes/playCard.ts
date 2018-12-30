import {
    Cards,
    CARD_TYPES,
    TAGS_LIST,
    TAGS,
    // EVENTS,
    Effects,
    ZONES
} from '../data/constants';
import mechanics from './mechanics';
import {
    createCard,
    // CardDefinitionsIndex,
} from './cardUniverse';


function playFromHand ({card, game, board, $, target, position}: {
    card: Cards.Card,
    game: any,
    $: any,
    board: any,
    target: Cards.Card,
    position: number,
}) {
    if (!card) throw new RangeError('Card must be provided');
    // console.log('playCard.ts::DEBUG', card);

    if (!card.owner === game.activePlayer) {
        console.warn(`playCard: ${card.owner.name} cannot play card on other player's turn`);
        return () => {};
    }
    if (card.zone !== ZONES.hand) {
        console.warn(`playCard: ${card.name} is not in hand, but rather in: ${card.zone}`);
        return () => {};
    }
    if (card.cost > card.owner.mana) {
        console.warn(`playCard: cannot play card ${card} - not enough mana`);
        return () => {};
    }

    card.owner.mana -= card.cost;

    console.log(`playCard: ${card.owner.name} played `, card.name);

    const params = {card, game, $, target, position, board};

    if (card.type === CARD_TYPES.spell) {
        board._playFromHand(card);
        doSpellAction(card, params);
    } else if (card.type === CARD_TYPES.minion) {
        summonMinion(card, board, game);
        doBattlecry(card, params);
    } else if (card.type === CARD_TYPES.hero) {
        // changeHero(card, board);
        doBattlecry(card, params);
    } else if (card.type === CARD_TYPES.weapon) {
        // equipWeapon(card, board);
        doBattlecry(card, params);
    } else {
        throw `Unexpected type of card to be played from hand: ${card.type}`
    }
}

function doBattlecry (card: Cards.Card, args) {
    if (!card.play) return;

    const { target, game, $, board } = args;
    if (target && !card.target) throw `unexpected target for card which does not need it: ${args.target, card.target}`;
    if (!target && card.target) return;

    card.play({
        self: card,
        ...args,
        ...mechanics(card, game, $, board)
    });
}
function doSpellAction (card: Cards.Card, args) {
    const { target, game, $, board } = args;
    if (!card.play) throw `Spell ${card.name} has no action!`
    if (target && !card.target) throw `unexpected target for card which does not need it: ${args.target, card.target}`;
    if (!target && card.target && !card.targetIsOptional) {
        throw `spell which require target, MUST have target: ${card} | ${card.target}`;
    }

    card.play({
        self: card,
        ...args,
        ...mechanics(card, game, $, board)
    });
}

function summonMinion (card: Cards.Card, board, game) {
    if (card.type !== CARD_TYPES.minion) {
        return;
    }
    // this.board.$('own minions').forEach((v,i) => {
    //   v.position = i;
    // });
    board._summon(card);//({position}); // position is IGNORED for now


    if (card.tags.has(TAGS.has_aura)) {
        console.log(`${card} has aura ! ${card._current.auras}`);
        card._current.auras.forEach(auraConfig => {
            let id = auraConfig.buffId;
            if (!id) {
                // assume its just a tag-aura, no further action needed
                return;
            }
            const c_aura = createCard(id, card.owner, game.eventBus);
            if (c_aura.type !== 'ENCHANTMENT') {
                throw `Invalid id ${id} used in aura! actual card is ${c_aura}`;
            }
            board.add(c_aura);
            board._putInPlay(c_aura); // unsafe ? where is the destructor ? TODO: check for leaks
            auraConfig.auraActivated = c_aura as Cards.Enchantment; // ts does not infer :(
            console.log(`Activated aura for ${card}`);
        });
    }

    let firstBuffWithTriggers = card._effects.original.find(v => !!v.on); // should be .filter, as there could be more than one
    const _trigger_v1: Effects.TriggerContainer = firstBuffWithTriggers && firstBuffWithTriggers.on[0];

    if(_trigger_v1 && _trigger_v1.zone === 'PLAY') {
        console.log(`playCard.js: ${card.name} trigger ...`);
        // {
        //   activeZone: 'deck',
        //   eventName: 'summon',
        //   condition: 'own minion .race=pirate',
        //   action: ({summon, self}) => summon(self)
        // }
        let event_name = _trigger_v1.event;
        let listener = function (evt) {
            let $ = board._$(card.owner);
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
            console.log(`TRIGGER: action !active:${game.activePlayer.name} owner:${card.owner.name} ! ${event_name} [${card} @${card.zone}]`);
            _trigger_v1.action({
                self: card,
                target: evt.target,
                // position, - not applicable ?
                $,
                game,
                ...mechanics(card, game, $, board)
            });
        }.bind(game);
        game.eventBus.on(event_name, listener);
        console.log(`${card.name} is now listening to ${event_name}`);
        card._listener = [event_name, listener];
    } else {
        //console.log('Hand.js NO TRIGGERS in ', Reflect.ownKeys(card));
    }

    card._refresh();
    // console.log('playCARD:', card, card.play, card._trigger_v1);
};

export {
    playFromHand as playCard
};
