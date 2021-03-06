import ArrayOfCards from './arrayOfCards';

import {
    U2,
    Types,
    ZONES as Z,
    TAGS, // :(
    // PLAYERCLASS,
    AoC,
    Cards,
    // GameOptions,
    // ACTION_TYPES,
    CARD_TYPES
} from '../data/constants';

// import { MapString } from '../shared.interface';
import { Card } from './card';
// import Player from './player';
// import { GameState } from './gameLoop';

type Player = any;
type GameState = any;

type C = Cards.Card;

type bZx = U2<Types.ZonesAllCAPS, C[]>
type bZ = U2<Types.ZonesAllCAPS, Set<C>>
type bT = U2<Types.CardsAllCAPS, Set<C>>

function intersect<T=any> (smaller: Set<T>, larger: Set<T>): Set<T> {
    return new Set(
        [...smaller].filter(x => larger.has(x))
    );
}

function intersect2<T=any> (smaller: Set<T>, larger: Set<T>): Set<T> {
    const r = new Set(smaller);
    r.forEach(x => larger.has(x) || r.delete(x));
    return r;
}

// --- QueryBuilder ----
type CardFilterFunction = (a: Cards.Card) => boolean;
type FilterAccumulator = {
    owners: Set<Player>;
    types: Set<string>; //
    zones: Set<string>; //
    tags: Set<string>;
    props: null;
    ownPlayer: Player;
    enemyPlayer: Player;
}
/** reducer for simple enum tokens */
function buildFilterSets (a: FilterAccumulator, t: string) {
    // TODO: there is a bug with "own hero" method :(

    switch (t) {
        // -- PLAYERS --
        case 'any':
            a.owners.clear();
            break;
        case 'own':
            a.owners.add(a.ownPlayer);
            break;
        case 'enemy':
            a.owners.add(a.enemyPlayer);
            break;
        // -- TYPES --
        case 'card':
            a.types.clear();
            break;
        case 'minion':
            a.types.add(CARD_TYPES.minion);
            break;
        case 'hero':
            a.types.add(CARD_TYPES.hero);
            break;
        case 'character':
            a.types.add(CARD_TYPES.hero).add(CARD_TYPES.minion);
            break;
        case 'weapon':
            a.types.add(CARD_TYPES.weapon);
            break;
        case 'spell':
            a.types.add(CARD_TYPES.spell);
            break;
        // -- ZONES --
        case '@deck':
            a.zones.add(Z.deck);
            break;
        case '@hand':
            a.zones.add(Z.hand);
            break;
        case '@aside':
            a.zones.add(Z.aside);
            break;
        case '@play':
            a.zones.add(Z.play);
            break;
        case '@grave':
            a.zones.add(Z.grave);
            break;
        default:
            break;
    }
    return a;
}


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
    // private byZone_s: bZ = {
    //     PLAY: new Set<C>(),
    //     HAND: new Set<C>(),
    //     DECK: new Set<C>(),
    //     GRAVE: new Set<C>(),
    //     ASIDE: new Set<C>()
    // };
    private byZone: bZx = {
        PLAY: [],
        HAND: [],
        DECK: [],
        GRAVE: [],
        ASIDE: []
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

        this.all = d1.concat(d2);
        this.all.forEach(c => this.initCache(c));
        this.all = this.all.map(c => this.placeCardInit(c));

        console.log(`board setup ready!`, p1.name, p2.name);
    }
    select<T extends C = C>(this: this, p: Player, query: string): C[] {
        const isVaidSelector = /^(any|own|enemy)?\s*(card|minion|hero|character|weapon|spell)?\s*(@(deck|hand|play|grave|aside|secret))?/.test(query);
        if (!isVaidSelector) throw 'Selector syntaxt invalid';

        const [
            ownPlayer,
            enemyPlayer
        ] = this.player1 === p ? [this.player1, this.player2] : [this.player2, this.player1];

        let tokens = query.split(/\s+/);
        const searchQuery = tokens.reduce(buildFilterSets, {
            ownPlayer: ownPlayer,
            enemyPlayer: enemyPlayer,
            owners: new Set() as Set<Player>,
            types: new Set() as Set<string>,
            zones: new Set() as Set<string>,
            tags: new Set() as Set<string>,
            props: null
        });

        if (!searchQuery.zones.size) {
            searchQuery.zones.add(Z.play);
        }
        // if (!board2xxx.types.size) {
        //     board2xxx.types.add(CARD_TYPES.card); // -- might be needed if we add Game and Player as entity
        // }

        let baskets: C[] = [];
        searchQuery.zones.forEach(z => baskets = baskets.concat(this.byZone[z]));

        let filters = [];

        // zone is the most discriminating of light weight checks
        // type less so - because 99% of @play are minions or heroes
        if (searchQuery.types.size) {
            filters.push(function (v: Cards.Card) {
                return searchQuery.types.has(v.type);
            })
        }
        if (searchQuery.owners.size) {
            filters.push(function (v: Cards.Card) {
                return searchQuery.owners.has(v.owner);
            })
        }

        let result = filters.reduce((a,v) => a.filter(v), baskets);

        return result;
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
    deck (p: Player) {
        console.log( this.byZone[Z.deck].map(v => `${v.card_id}:${v.zone}`) );
        return (this.byZone[Z.deck]
            .filter(v => this.byOwner.get(p).has(v))
        );
    }
    hand (p: Player) {
        return this.byZone[Z.hand]
            .filter(v => this.byOwner.get(p).has(v));
    }
    // playable card ONLY make sence for active player
    playableCards (p: Player) {
        return this.hand(p).filter(v => v.cost <= p.mana);
        // todo: add mandatory targets
    }

    initCache (this: this, card: C) {
        if (typeof card.name !== 'string' || typeof card !== 'object') {
            throw `Some junk is stored in the board! ${card}`;
        }
        this.byType[card.type].add(card);
        this.byZone[card.zone].push(card);
        this.byOwner.get(card.owner).add(card);
    }
    add(this: this, card: C, zone?: Types.ZonesAllCAPS): this {
        if (typeof card.name !== 'string' || typeof card !== 'object') {
            throw `Some junk is being added to board! ${card}`;
        }
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
            let old_zone = card.zone;

            let from = this.byZone[card.zone];

            if (!from) throw `${card.name} #${card.card_id} has empty zone: ${card.zone}, ${card}, ${typeof card}`;
            let idx = from.indexOf(card);
            if (idx) {
                from.splice(idx, 1);
            }
            card.zone = zone;
            let to = this.byZone[zone];
            to.push(card);

            console.log(old_zone, idx);
            console.log(`${ JSON.stringify({
                ['all']: this.all.length,
                [Z.aside]: this.byZone[Z.aside].length,
                [Z.deck]: this.byZone[Z.deck].length,
                [Z.hand]: this.byZone[Z.hand].length,
                [Z.play]: this.byZone[Z.play].length,
                [Z.grave]: this.byZone[Z.grave].length,
            })}`);
        }

        if (owner) {
            this.byOwner.get(card.owner).delete(card);
            card.owner = owner;
            this.byOwner.get(owner).add(card);
        }

        console.log(`${card.name} #${card.card_id} -> ${
            (zone && owner) ?
                [zone, owner.name]
            : (zone || owner.name )
        }`);

        return this;
    }
    placeCardInit (card: C) {
        this.add(card, Z.deck);
        if (card.type === CARD_TYPES.hero && !card.owner.hero) {
            card.owner.hero = card;
            this.move(card, Z.play);
        }
        return card;
    }
    /**
     * https://hearthstone.gamepedia.com/Advanced_rulebook#Moving_between_Zones
     */
    private move(card: C, to: Types.ZonesAllCAPS, from?: string): this {
        const actualFrom = card.zone;
        if (from && from !== actualFrom) {
            throw `expected ${card.name} #${card.card_id} to be in ${from}, but it is in ${actualFrom}`;
        }

        const MAX_HAND_SIZE = 10;
        const MAX_MINIONS_IN_PLAY = 7;

        // -- not more that 10 cards in hand
        if (to === Z.hand
            && this.hand(card.owner).length >= MAX_HAND_SIZE
        ) {
            console.log(`${card.owner.name} My hand is too full !`);
            to = Z.grave;
        }
        // -- not more that 7 minions
        if (to === Z.play
            && card.type === CARD_TYPES.minion
            && this.byZone[Z.play].filter(c =>
                intersect(
                    this.byType.MINION,
                    this.byOwner.get(card.owner)
                ).has(c)
            ).length >= MAX_MINIONS_IN_PLAY
        ) {
            to = Z.grave;
        }
        // -- new hero replaces existing one
        // if (to === Z.play
        //     && card.type === CARD_TYPES.hero
        // ) {
        //     const oldHeroes = intersect(intersect(
        //         this.byZone[Z.play],
        //         this.byType.HERO),
        //         this.byOwner.get(card.owner)
        //     );
        //     if (oldHeroes.size > 1) throw `Invalid state: more than 1 hero for player ${card.owner.name}`
        //     if (oldHeroes.size === 1) {
        //         let oldHero = [...oldHeroes][0];
        //         this._update(oldHero, {zone: Z.grave})
        //     }
        // }
        // TBD -- new weapon replaces existing one
        // TBD -- new weapon replaces existing one
        // TBD -- new hero_power replaces existing one
        // TBD -- new secret cannot be added if same one exists

        this._update(card, {zone: to})
        return this;
    }
    private possess(card: C, player: Player): this {
        // new Card(card, {owner: player}
        return this;
    }
    draw(this: this, p: Player, n: number): C[] {
        const MAX_HAND_SIZE = 10;
        let r = [];
        let deckProxy = this.deck(p);
        for (let i = 0; i < n; i++) {
            let card = deckProxy.shift();
            if (card.zone !== Z.deck) throw `Attempt to draw ${card.name} #${card.card_id} NOT from deck, but from: ${card.zone}`;

            if (!card) {
                p.hero.dealDamage(p.fatigue++);
                continue;
            }
            this.move(card, Z.hand);
            r.push(card);
        };
        return r;
    }
    _playFromHand(this: this, card: Cards.Card) {
        if (card.type === CARD_TYPES.spell) {
            this.move(card, Z.grave, Z.hand);
        }
        this.move(card, Z.play, Z.hand);
    }
    _putInPlay(this: this, card: Cards.Card) {
        if (card.type !== CARD_TYPES.enchantment) {
            throw `do not putin`;
        }
        this.move(card, Z.play, Z.aside);
    }
    _summon(this: this, card: Cards.Card) {
        this.move(card, Z.play);

        // this.eventBus.emit(EVENTS.minion_summoned, {
        //     target: this
        // });

        //console.log(`board5.ts :: summoned ${this.name} for ${this.owner.name}`);
    }
    mill(this: this, card: Cards.Card) {
        console.log(`️DISCARDED: ${card.owner.name}'s ${card.name}`);
        this.move(card, Z.grave);
    }
    kill(this: this, card: Cards.Card) {
        console.log(`☠️ ${card.type.toLowerCase()} died: ${card.owner.name}'s ${card.name}`);
        //this.death && this.death({self: this, $: game.board.$, game}); // deathrattle
        if (card.zone === Z.grave) {
            throw `Dont kill dead cards .. again! ${card.name} #${card.card_id}`;
        }
        this.move(card, Z.grave);
        if (card.type === CARD_TYPES.hero) {
            card.owner.loose();
        }
    }
    copyCard() {
        // todo: this never worked
        // let copy = (new (this.constructor as any)(this, this.owner));
        // // copy.tags[] are DIRTY !
        // copy.zone = ZONES.aside;
    }
    // --------------
    viewStateForPlayer (this: this, player: Player): void {
        console.log(
            this.byZone.DECK.length,
            this.byZone.HAND.length,
            this.byZone.PLAY.length,
            this.byZone.GRAVE.length
        );
        let own_minions = this.select<Cards.Character>(player, 'own minion');

        //console.log(own_minions.map(({buffs, incomingAuras, tags}) => {return {buffs, incomingAuras, tags}} ))

        if (own_minions.length > 7) throw 'Invalid state: more that 7 minions on board.';

        console.log(`
  player:${player.name} hp❤️:${player.hero.health} mana💎:${player.mana}/${player.manaCrystals} deck:${player.deck.size} hand:${this.hand(player).length} ${this.hand(player).map(v=>v.cost +') ' + v.name)}`
        );
        //console.log(this.board.$(player, 'own minion').map(v => v.name));

        /** this is a HACK: fix type errors in fancy way */
        function isObjectTag (v: any): v is ({
          death: any,
          aura: any,
          trigger: any,
          type: any
        }) {
          return typeof v !== 'string';
        }

        console.log('minions on board', own_minions.map(v=>
        (v.tags && v.tags.includes(TAGS.taunt) ? '🛡️' : '') +
        (v.tags && v.tags.includes(TAGS.divineShield) ? '🛡' : '') +
        (v.tags && v.tags.includes(TAGS.windfury) ? 'w' : '') +
        (v.tags && v.tags.includes(TAGS.charge) ? '!' : '') +


        (v.tags.filter(isObjectTag).find(v => !!v.death) ? '☠️' : '') +
        (v.tags.filter(isObjectTag).find(v => !!v.trigger) ? 'T' : '') +
        (v.tags.filter(isObjectTag).find(v => !!v.aura) ? 'A' : '') +
        (v.tags.filter(isObjectTag).find(v => v.type === CARD_TYPES.enchantment) ? 'E' : '') +
        (v.incomingAuras.length ? 'a' : '') +

        `${v.attack}/${v.health}`
        ));
    }
}
