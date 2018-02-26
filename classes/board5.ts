import ArrayOfCards from './arrayOfCards';

import {
    // ZONES,
    TAGS,
    // PLAYERCLASS,
    AoC,
    Cards,
    // GameOptions,
    // ACTION_TYPES,
    CARD_TYPES
} from '../data/constants';

// import { MapString } from '../shared.interface';
import { Card } from './card';
import Player from './player';
import { GameState } from './gameLoop';

type C = Cards.Card;

export class Board {
    private all: C[] = [];

    // no
    activePlayer: Player = null;
    passivePlayer: Player = null;
    // should be
    player1: Player = null;
    player2: Player = null;
    game: GameState = null;
    // game.owner === activePlayer

    private byOwner = new Map<Player, Set<C>>();
    private byZone = {
        PLAY: new Set<C>(),
        HAND: new Set<C>(),
        DECK: new Set<C>(),
        GRAVE: new Set<C>(),
        SETASIDE: new Set<C>(), // or ASIDE ?
    };
    private byType = {
        // lol GAME: new Set<C>(),
        // lol PLAYER: new Set<C>(),
        HERO: new Set<C>(),
        HERO_POWER: new Set<C>(),
        MINION: new Set<C>(),
        CHARACTER: new Set<C>(), // ?
        SPELL: new Set<C>(),
        WEAPON: new Set<C>(),
        ENCHANTMENT: new Set<C>(),
    };
    private activeMechanics = {
        AURA: new Set<C>(), // ?
        SECRET: new Set<C>(), // ?
        TRIGGER: new Set<C>()
    }

    constructor(
        g: GameState,
        [p1, d1]: [Player, C[]],
        [p2, d2]: [Player, C[]],
        eb: any
    ) {
        this.all = d1.concat(d2);
        this.game = g;
        this.player1 = p1;
        this.player2 = p2;

        // todo: - update caches

    }
    select<T extends C = C>(this: this, p: Player, query: string): C[] {
        // TODO: implement

        return [];
    }
    _$(ownPlayer: Player) {
        return <T extends C = C>(query: string): AoC<T> => {
            // TODO: make sure this is bound properly
            const result = this.select(ownPlayer, query);
            return (new ArrayOfCards()).concat(result) as AoC<T>;
        }
    }
    private $<T extends C = C>(query: string): AoC<T> {
        // TODO: make sure this is bound properly
        const result = this.select(this.activePlayer, query);
        return (new ArrayOfCards()).concat(result) as AoC<T>;
    }
    add(card: C): this {

        return this;
    }
    /** SAVE card AndUpdateCache AND version */
    private _save(this: this, card: C): this {
        return this;
    }
    private move(card: C, from: string, to: string): this {
        // if (!zone === from) throw
        // new Card(card, {zone: to}
        return this;
    }
    private control(card: C, player: Player): this {
        // new Card(card, {owner: player}
        return this;
    }
    // ? card stateMachine methods ?
    /** @deprecated */
    nextTurn() {

    }
    /** @deprecated */
    endGame(result: string, winner: Player) {

    }
}
