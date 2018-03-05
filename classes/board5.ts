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
import Player from './player';
import { GameState } from './gameLoop';

type C = Cards.Card;

type bZ = U2<Types.ZonesAllCAPS, Set<C>>
type bT = U2<Types.CardsAllCAPS, Set<C>>

function intersect<T=any> (smaller: Set<T>, larger: Set<T>): Set<T> {
    return new Set(
        [...smaller].filter(x => larger.has(x))
    );
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
        // TODO: put real implementation here :)
        const enemyP = (p === this.activePlayer) ? this.passivePlayer : this.activePlayer;

        switch (query) {
            case '*': return this.all;
            case 'character': return [
                p.hero, // todo: replace this hack with working selectors ASAP!
                enemyP.hero,
                ...intersect(this.byZone.PLAY, this.byType.MINION)
            ];
            case 'own character': return [
                p.hero,
                ...intersect(intersect(this.byZone.PLAY, this.byType.MINION), this.byOwner.get(p))
            ];
            case 'enemy character':
                return [
                    enemyP.hero,
                    ...intersect(intersect(this.byZone.PLAY, this.byType.MINION), this.byOwner.get(enemyP))
                ];
            case 'own minion': return [
                ...intersect(intersect(this.byZone.PLAY, this.byType.MINION), this.byOwner.get(p))
            ];
        }

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
    deck (p: Player) {
        return [...this.byZone[Z.deck]].filter(v => this.byOwner.get(p).has(v))
    }
    hand (p: Player) {
        return [...this.byZone[Z.hand]].filter(v => this.byOwner.get(p).has(v))
    }
    // playable card ONLY make sence for active player
    playableCards (p: Player) {
        return this.hand(p).filter(v => v.cost <= p.mana);
        // todo: add mandatory targets
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
    /**
     * https://hearthstone.gamepedia.com/Advanced_rulebook#Moving_between_Zones
     */
    private move(card: C, to: Types.ZonesAllCAPS, from?: string): this {
        const MAX_HAND_SIZE = 10;
        const MAX_MINIONS_IN_PLAY = 7;

        // -- not more that 10 cards in hand
        if (to === Z.hand
            && intersect(
                this.byZone[Z.hand],
                this.byOwner.get(card.owner)
            ).size >= MAX_HAND_SIZE
        ) {
            to = Z.grave;
        }
        // -- not more that 7 minions
        if (to === Z.play
            && card.type === CARD_TYPES.minion
            &&  intersect(intersect(
                 this.byZone[Z.play],
                this.byOwner.get(card.owner)
            ), this.byType.MINION).size >= MAX_MINIONS_IN_PLAY) {
            to = Z.grave;
        }
        // -- new hero replaces existing one
        if (to === Z.play
            && card.type === CARD_TYPES.hero
        ) {
            const oldHeroes = intersect(intersect(
                this.byZone[Z.play],
                this.byType.HERO),
                this.byOwner.get(card.owner)
            );
            if (oldHeroes.size > 1) throw `Invalid state: more than 1 hero for player ${card.owner.name}`
            if (oldHeroes.size === 1) {
                let oldHero = [...oldHeroes][0];
                this._update(oldHero, {zone: Z.grave})
            }
        }
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
        //legacy assert: if (this.zone !== ZONES.deck) throw `Attempt to draw ${this.name} #${this.card_id} NOT from deck, but from: ${this.zone}`;

        const MAX_HAND_SIZE = 10;
        let r = [];
        for (let i = 0; i < n; i++) {
            //
            let c = [...this.deck(p)][0];
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
    _playFromHand(this: this, card: Cards.Card) {
        if (card.type === CARD_TYPES.spell) {
            this.move(card, Z.grave, Z.hand);
        }
        this.move(card, Z.play, Z.hand);
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
