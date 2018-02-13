'use strict';
// @ts-check

const {
    createCard,
    _cardDefinitionArray,
    // CardDefinitionsIndex,
    // _progress
} = require('./cardUniverse.js');
const Deck = require('./deck.js');
const {
    ZONES
} = require('../data/constants.js');

const EventEmitter = require('events');
class EventBus extends EventEmitter {
    // just in case if i decide to add helper methods..
}
const Player = require('./player.js');
const Game = require('./game.js');


const STARTING_DECK_SIZE = 30; // change to 300 if you want to stress test selectors


/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @param {Object} eb
 */
function bootstrap(arr1, arr2, eb) {
    [
        arr1.concat(eb),
        arr2.concat(eb)
    ].forEach(function (arr) {
        bootstrapPlayer(...arr);
    });
}

/**
 *
 * @param {Player} player
 * @param {string} hero_card_id
 * @param {Array} starting_deck
 * @param {Object} eventBus
 */
function bootstrapPlayer(player, hero_card_id, starting_deck, eventBus) {
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

/**
 *
 * @param {Array} param0
 * @param {Aray} param1
 * @param {?Object} eb
 * @returns {Game} new game
 */
function initGame([name1, hero_id_1], [name2, hero_id_2], eb) {
    let p1 = new Player(name1);
    let p2 = new Player(name2);
    if (!eb) eb = new EventBus();

    bootstrap(
        [p1, hero_id_1, []],
        [p2, hero_id_2, []],
        eb
    );
    //throw 'aaa';
    //console.log(Game, Game.toString(), JSON.stringify(Game));
    let game = new Game([
        p1,
        p2
    ], eb);

    return game;
}

module.exports = {
    bootstrap,
    initGame
};