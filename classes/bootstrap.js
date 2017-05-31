'use strict';
// @ts-check

const EventEmitter = require('events');
class EventBus extends EventEmitter {
  // just in case if i decide to add helper methods..
}
const Player = require('./player.js');
const Game = require('./game.js');


const {
  bootstrap,
//  CardDefinitionsIndex,
//  _progress
} = require('./cardUniverse.js');


/**
 * 
 * @param {Array} param0 
 * @param {Aray} param1 
 * @param {?Object} eb
 * @returns {Game} new game 
 */
function bootstrap2 ([name1, hero_id_1], [name2, hero_id_2], eb) {    
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

module.exports = bootstrap2;