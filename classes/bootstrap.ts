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

function generateWorldState (
    player: Player,
    hero_card_id: string,
    state: any[],
    eventBus: EventBus
) {

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

// const stateOverride = {
//     game: {
//         turn, turnMax
//     },
//     activePlayer: 1,
//     passivePlayer: 2,
//     p1_state: ['hero1', 'power1', 'everyhingElse'],
//     p2_state: ['hero2', 'power2', 'everyhingElse'],
//     p2_: {
//         hero: 'hero',
//         power: 'p',
//         weapon: {
//             seq: 3,
//             ref: 'enemy_p',
//             id: 'xx',
//             name: 'A a',
//             attack: 12,
//             durability: 3
//         },
//         minions: ['minions'],
//         hand: [],
//         deck: [],
//         grave: []
//     }
// };

function initGame (
    [name1, deck1]: PlayerConfig,
    [name2, deck2]: PlayerConfig,
    state?: object
) {
    const eb = new EventBus();

    // const rules = {}; // max, min, etc
    // const state = {}; // current turn, mana, etc

    const defaultState = {
        g: gameDef(),
        p1: playerDef(name1),
        p2: playerDef(name2)
    };
    const initialState = defaultState; // << state

    const g = new Game(initialState.g, eb);
    const p1 = new Player(initialState.p1, eb);
    const p2 = new Player(initialState.p1, eb);

    // const d1 = generateDeck(deck1);
    // const d2 = generateDeck(deck2);
    const d1 = generateDeck_legacy(p1, deck1[0], [], eb);
    const d2 = generateDeck_legacy(p2, deck2[0], [], eb);

    const board = new Board(g, [p1, d1], [p2, d2]);
    const runner = new GameLoop(board, [p1, p2], eb);

    return runner;
}

const _profile = profileGame;
export {
    initGame,
    _profile as _GAME_profile
};
