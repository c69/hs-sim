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
    ZONES,
    CardDefinition
} from '../data/constants';

import { Board } from './board7';
import { Card, Game, Player, Minion } from './card';
import { GameLoop, profileGame } from './gameLoop';
import { parse_row, tail_split } from './state-dsl-tokenizer';
import { assignDefined } from './utils';

const STARTING_DECK_SIZE = 30; // change to 300 if you want to stress test selectors

// function generateDeck([hero, ...others]: string[]): Card[] {
//     return [new Card.Hero(hero), ...(shuffle(others.map(cardFromName)))];
// }

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

function generateBoard (
    player: Player,
    minions: CardDefinition[] = [],
    eventBus: EventBus
) {
    return minions.map(v => {
        const d = minionDef(v);
        return new Minion(d, player, eventBus);
    });
}

interface EntityDef {
    id: string;
    type: 'GAME' | 'PLAYER';
    name: string;
    _info: string;
    text: string;
}
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
function minionDef(override: Partial<CardDefinition> = {}): CardDefinition {
    return {
        id: 'HS-SIM_TestMinion_001',
        type: CARD_TYPES.minion,
        name: 'Mindless Minion',
        attack: ('attack' in override) ? override.attack : 0,
        health:  ('health' in override) ? override.health : 1,
        tags: ('tags' in override) ? override.tags : [],
        _info: '',
        text: ''
      };
}
function defaultStateDef (override = {}) {
    return assignDefined({
        game: { turn: 1 },
        p1: {
            mana: 0, manaCrystals: 0, fatigue: 1,
            minions: '',
            hero: '0/30/0:HERO_01',
            hand: '',
            deck: '',
            grave: ''
        },
        p2: {
            mana: 0, manaCrystals: 0, fatigue: 1,
            minions: '',
            hero: '0/30/0:HERO_01',
            hand: '',
            deck: '',
            grave: ''
        }
    }, override);
}
type PlayerConfig = [string, string[]];

function initGame (
    [name1, deck1]: PlayerConfig,
    [name2, deck2]: PlayerConfig,
    state?: object
) {
    const eb = new EventBus();

    // const rules = {}; // max, min, etc

    const defaultDefs = new Map<string, EntityDef>([
        ['g', gameDef()],
        ['p1', playerDef(name1)],
        ['p2', playerDef(name2)]
    ]);

    //g .turn, .maxTurn
    //p .mana .manaCrystals .active .first // MAYBE manaMax ?
    // p minions / hero / hand / deck / grave
    const g = new Game(defaultDefs.get('g'), eb);
    const p1 = new Player(defaultDefs.get('p1'), eb);
    const p2 = new Player(defaultDefs.get('p2'), eb);

    // :( .. Players are not comparable
    // [cannot] if (p1 === p2) throw

    // const d1 = generateDeck(deck1);
    // const d2 = generateDeck(deck2);

    const initialState = defaultStateDef(state);

    const [m1, m2] = ['p1', 'p2'].map((p,i) => {
        const { minions } = initialState[p];
        if (!minions) return [];
        return generateBoard(
            i===0 ? p1 : p2,
            parse_row('PLAY.minion', tail_split(minions)),
            eb
        );
    });

    const d1 = generateDeck_legacy(p1, deck1[0], [], eb);
    const d2 = generateDeck_legacy(p2, deck2[0], [], eb);

    const board = new Board(g, [p1, d1], [p2, d2]);
    board.add_as_OVERRIDE(m1);
    board.add_as_OVERRIDE(m2);

    const runner = new GameLoop(board, [p1, p2], eb);

    return runner;
}

const _profile = profileGame;
export {
    initGame,
    _profile as _GAME_profile
};
