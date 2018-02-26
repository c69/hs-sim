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

import { Board } from './board5';
import Player from './player';
import { Card } from './card';
import {
    GameLoop,
    GameState
} from './gameLoop';


const STARTING_DECK_SIZE = 30; // change to 300 if you want to stress test selectors


function generateDeck_legacy (
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

    return deck;
}
// function generateDeck([hero, ...others]: string[]): Card[] {
//     return [new Card.Hero(hero), ...(shuffle(others.map(cardFromName)))];
// }



type PlayerConfig = [string, string[]];

function initGame (
    [name1, deck1]: PlayerConfig,
    [name2, deck2]: PlayerConfig
) {
    const rules = {}; // max, min, etc
    const state = {}; // current turn, mana, etc
    const g = new GameState({rules, state});
    const p1 = new Player(name1);
    const p2 = new Player(name2);
    // const d1 = generateDeck(deck1);
    // const d2 = generateDeck(deck2);
    const eb = new EventBus();
    const d1 = generateDeck_legacy(p1, deck1[0], [], eb);
    const d2 = generateDeck_legacy(p2, deck2[0], [], eb);

    const board = new Board(g, [p1, d1], [p2, d2], eb);
    const runner = new GameLoop(board, [p1, p2], eb);

    return runner;
}

const _profile = GameLoop._profile;
export {
    initGame,
    _profile as _GAME_profile
};
