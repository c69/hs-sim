/// <reference types="node" />

import EventEmitter = require('events');
class EventBus extends EventEmitter {
    // just in case if i decide to add helper methods..
}
import {
    createCard,
    _cardDefinitionArray,
    // CardDefinitionsIndex,
    // _progress
} from './cardUniverse';
import Deck from './deck';
import {
    ZONES
} from '../data/constants';

import Player from './player';
import { Card } from './card';
import { Game } from './gameLoop';


const STARTING_DECK_SIZE = 30; // change to 300 if you want to stress test selectors


/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @param {Object} eb
 */
function bootstrap(
    arr1: [Player, string, Card[]],
    arr2: [Player, string, Card[]],
    eb: EventBus
) {
    [
        arr1, //.concat(eb),
        arr2 // .concat(eb)
    ].forEach(function (arr) {
        // TS does not like spread (...arr)
        bootstrapPlayer(arr[0], arr[1], arr[2], eb);
    });
}

function bootstrapPlayer(
    player: Player,
    hero_card_id: string,
    starting_deck: Card[],
    eventBus: EventBus
) {
    player.deck = new Deck([]);
    let deck = player.deck._arr;

    //add Hero, and put it in play
    deck.push(createCard(hero_card_id, player, eventBus));
    deck[0].zone = ZONES.play;

    //add 30 random cards to deck
    for (let i = 0; i < STARTING_DECK_SIZE; i++) {
        let dice = Math.floor(Math.random() * (_cardDefinitionArray.length));
        let card = _cardDefinitionArray[dice];

        let new_card = createCard(card.id, player, eventBus);
        deck.push(new_card);
    }
}

function initGame(
    [name1, hero_id_1]: [string, string],
    [name2, hero_id_2]: [string, string],
    eb?: EventBus
) {
    // console.log('initializing players');

    const p1 = new Player(name1);
    const p2 = new Player(name2);
    if (!eb) {
        eb = new EventBus();
    }
    bootstrap(
        [p1, hero_id_1, []],
        [p2, hero_id_2, []],
        eb
    );
    //console.log(Game, Game.toString(), JSON.stringify(Game));
    const game = new Game([
        p1,
        p2
    ], eb);

    return game;
}

const _profile = Game._profile;
export {
    bootstrap,
    initGame,
    _profile as _GAME_profile
};
