import ArrayOfCards from './arrayOfCards';

import {
    U2,
    Types,
    ZONES as Z,
    // TAGS,
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

type bZ = U2<Types.ZonesAllCAPS, Set<C>>
type bT = U2<Types.CardsAllCAPS, Set<C>>

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
    private byZone: bZ = {
        PLAY: new Set<C>(),
        HAND: new Set<C>(),
        DECK: new Set<C>(),
        GRAVE: new Set<C>(),
        ASIDE: new Set<C>()
    };
    private byType: bT = {
        GAME: new Set<C>(),
        PLAYER: new Set<C>(),

        HERO: new Set<C>(),
        HERO_POWER: new Set<C>(),
        MINION: new Set<C>(),
        SPELL: new Set<C>(),
        WEAPON: new Set<C>(),
        ENCHANTMENT: new Set<C>(),

        CHARACTER: new Set<C>(), // ?
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
        this.game = g;
        this.player1 = p1;
        this.player2 = p2;
        this.byOwner.set(p1, new Set());
        this.byOwner.set(p2, new Set());
        p1.draw = (n: number) => {
            this.draw(p1, n);
        }
        p2.draw = (n: number) => {
            this.draw(p2, n);
        }

        this.all = d1.concat(d2).map(c => this.placeCardInit(c));

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
    add(this: this, card: C): this {
        this.byType[card.type].add(card);
        this._update(card, {
            owner: card.owner,
            zone: Z.deck
        });
        return this;
    }
    /** SAVE card AndUpdateCache AND version */
    private _update(
        this: this,
        card: C,
        changes: {
            zone?: Types.ZonesAllCAPS,
            owner?: Player
        }): this {
        const {
            zone,
            owner
        } = changes;

        if (zone) {
            this.byZone[card.zone].delete(card);
            card.zone = zone;
            this.byZone[card.zone].add(card);
        }

        if (owner) {
            // console.log(owner, card.owner);
            this.byOwner.get(card.owner).delete(card);
            card.owner = owner;
            this.byOwner.get(card.owner).add(card);
        }

        return this;
    }
    placeCardInit (card: C) {
        this.add(card);
        if (card.type === CARD_TYPES.hero) {
            card.owner.hero = card;
            this.move(card, Z.play);
        }
        return card;
    }
    private move(card: C, to: Types.ZonesAllCAPS, from?: string): this {
        this._update(card, {zone: to})
        return this;
    }
    private control(card: C, player: Player): this {
        // new Card(card, {owner: player}
        return this;
    }
    draw(this: this, p: Player, n: number): C[] {
        const MAX_HAND_SIZE = 10;
        let r = [];
        for (let i = 0; i < n; i++) {
            let c = [...this.byZone[Z.deck]][0];
            if (!c) {
                p.hero.dealDamage(p.fatigue++);
                continue;
            }
            if (this.byZone[Z.hand].size >= MAX_HAND_SIZE) {
                this.move(c, Z.grave);
            } else {
                this.move(c, Z.hand);
            }
            r.push(c);
        };
        return r;
    }
}
