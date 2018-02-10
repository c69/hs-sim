
import ArrayOfCards = require('./arrayOfCards.js');

import {
    ZONES,
    CARD_TYPES,
    TAGS,
    PLAYERCLASS,
    ACTION_TYPES,
    Types,
    GameOptions
} from '../data/constants2';

type Zone = 'x';
type Card = {
    zone: string;
    // maybe im just reinventing ENUM ? :(
    z: typeof ZONES; // very WRONG..
    z1: Types.Zones; // still very WRONG..
}
type Character = Card;
type GameZones =  {
    play: Set<Card>;
    deck: Set<Card>;
    hand: Set<Card>;
    grave: Set<Card>;
    aside: Set<Card>;
}
type PlayerOwned = {
    0: Set<Card>;
    1: Set<Card>;
}
type EventConsumers = {
    on: Set<Card>;
    aura: Set<Card>;
}

let xxxx: GameOptions.Action = {
    type: 'ATTACK';
};
type GameOptionList = GameOptions.Options;

class PartiZone {


    constructor () {

    }
    _add (card: Card) {

    }
    _moveTo (card: Card, zone: Zone) {

    }
    _giveTo (card: Card, player: any) {

    }
    $ () {
    // return (new ArrayOfCards()).concat(arr_result);
    // return ArrayOfCards().from(set_result);
    }

    play () {}
    draw () {}
    discard () {}
    discover () {}
    summon () {}
}

let x = new PartiZone();


module.exports = Board;