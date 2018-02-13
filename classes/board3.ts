
import ArrayOfCards = require('./arrayOfCards.js');
import Board2 = require('./Board2.js');

import {
    ZONES,
    CARD_TYPES,
    TAGS,
    PLAYERCLASS,
    ACTION_TYPES,
    Types,
    GameOptions
} from '../data/constants2';

/* --- GOALS

- use predefined deck from simple open source format
- implement ONE popular deck (Keleseth Warlock, Freeze Mage, MSG Murloc Shaman)

- import fresh cards, merge abilities definitions
- put Game and Player entities into board, so they can have tags

- support Morph (Faceless, Echoing Ooze)
- support hero_power
- support animation_log (event_log)
- add unit tests and html coverage
- support is_powered_up (condition_met)
- support weapons (acidic swamp ooze, pirates)
- finish auras
- support heavy chained events (Defile, "summon Knife Juggler")
- fix silence
- support Steal (and Blessing of DrawCard)
- support Discover (Amber)
- support ChooseOne + feinhel
- add seed-based PRNG
- ??? ritual / script
- support quests
- support Combo
- support SpellBonus
- support Healing, onHeal and priest HERO_POWER
- support hero power switch
- support muligan
- support auchenai aura
- support malganis
- support fresh Darksteed






*/

type Zone = 'x';
type Card = {
    zone: string;
    // maybe im just reinventing ENUM ? :(
    z: typeof ZONES; // very WRONG..
    z1: Types.Zones; // still very WRONG..
}
type Character = Card;
type Player = Card;
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

namespace Entities {
    export type Game = {
        isOver: false;
    }
    export type Player = {
        name: string;
    }
    // export type Turn = {

    // }
    export type Card = {
        entity_id: number;
    }
    // export type Token = {

    // }
}
export class PartiZone {
    game: Entities.Game;
    constructor (rules: any) {
        this.allowedSets = 'ALL';
        this.gameLenght = 87; // turns
        this.turnDuration = 75; // seconds
        this.mulligan = true;
    }

    // create
    // state-machine w validation
    // query
    // events
    // extract-state
    // update-state and cache
    // mechanics

    // CREATE
    addPlayer (player: Entities.Player) {
    }
    startGame () {}
    add (card: Entities.Card) {

    }

    // STATE-MACHINE
    _moveTo (card: Entities.Card, zone: Zone) {

    }
    _giveTo (card: Entities.Card, player: Entities.Player) {

    }

    // QUERY
    $ (player: Entities.Player, selector_string: string) {
    // delegate all the heavy stuff to Board.js / Board2.js

    // return (new ArrayOfCards()).concat(arr_result);
    // return ArrayOfCards().from(set_result);
    }

    state.$('own minion') -> this.players[this.game.owner].minions;
    state.$('own player') -> this.game.owner;
    state.$('own game') -> this.game ???;
    state.$('own deck') -> this.activePlayer.deck ???;
    state.$('own starting-deck') -> this.activePlayer.deck ???;

    state.export();
    state.selectOption();
    state.availableOptions();
    state.whoCanAttack();
    state.playableCards();

    // mechanics

    summon () {}
    draw () {}
    buff () {}

    discard () {}
    discover () {}
    play () {} // should maybe battlecry be separate from play ? or at aleast rename ?
    return () {}
    morph () {}

    copy () {}
    copyExact () {} // or copy with buffs
    copyAndChange () {}
}

//
