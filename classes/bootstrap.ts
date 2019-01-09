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

import {
    CARD_TYPES,
    ZONES
} from '../data/constants';

import { Board } from './board7';
import { Card, Game, Player } from './card';
import { GameLoop, profileGame } from './gameLoop';

const STARTING_DECK_SIZE = 30; // change to 300 if you want to stress test selectors

function generateDeck_legacy (
    player: Player,
    hero_card_id: string,
    starting_deck: Card[],
    eventBus: EventBus
) {
    const deck: Card[] = [];
    //add Hero
    deck.push(createCard(hero_card_id, player, eventBus));

    //add 30 random cards to deck
    for (let i = 0; i < STARTING_DECK_SIZE; i++) {
        const dice = Math.floor(Math.random() * (_cardDefinitionArray.length));
        const card = _cardDefinitionArray[dice];

        const new_card = createCard(card.id, player, eventBus);
        deck.push(new_card);
    }

    return deck;
}
// function generateDeck([hero, ...others]: string[]): Card[] {
//     return [new Card.Hero(hero), ...(shuffle(others.map(cardFromName)))];
// }

function gameDef () {
    return {
        id: 'xxx_GAME_ENTITY',
        type: CARD_TYPES.game,
        name: 'GAME',
        _info: '...',
        text: '...'
    };
}
function playerDef (name: string) {
    return {
        id: 'xxx_PLAYER_ENTITY',
        type: CARD_TYPES.player,
        name: name,
        _info: '...',
        text: '...'
    };
}
type PlayerConfig = [string, string[]];

function initGame (
    [name1, deck1]: PlayerConfig,
    [name2, deck2]: PlayerConfig
) {
    const eb = new EventBus();

    // const rules = {}; // max, min, etc
    // const state = {}; // current turn, mana, etc

    // todo: simplify constructor signatures for game and player
    const g = new Game(gameDef(), eb);
    const p1 = new Player(playerDef(name1), eb);
    const p2 = new Player(playerDef(name2), eb);

    // const d1 = generateDeck(deck1);
    // const d2 = generateDeck(deck2);
    const d1 = generateDeck_legacy(p1, deck1[0], [], eb);
    const d2 = generateDeck_legacy(p2, deck2[0], [], eb);

    const board = new Board(g, [p1, d1], [p2, d2], eb);
    const runner = new GameLoop(board, [p1, p2], eb);

    return runner;
}

const _profile = profileGame;
export {
    initGame,
    _profile as _GAME_profile
};
