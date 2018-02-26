import ArrayOfCards from './arrayOfCards';

import {
    // ZONES,
    TAGS,
    // PLAYERCLASS,
    AoC,
    Cards,
    GameOptions,
    ACTION_TYPES,
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
    select<T extends C = C>(p: Player, query: string): C[] {
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
    /**
     * A nice GOD method
     * @returns {Object} options //options.actions[]<{id, type, name, ?unit, ?cost, ?targetList[], ?positionList[]}>
     */
    viewAvailableOptions() {
        const ggg = new GameState();
        //console.log(`refreshing options for ${this.activePlayer.name} on turn#${this.turn}`);
        if (!ggg.isStarted || ggg.isOver) {
            console.log('No options are available - game state is wrong.');
            return {
                // token ?
                actions: [] as GameOptions.Action[]
            };
        }
//        let $ = this._$.get(this.activePlayer);

        let pawns = this.$<Cards.Character>('own character');
        let warriors = pawns.filter(v => {
            if (v.attack < 1) return false;
            if (!v.isReady && !v.tags.includes(TAGS.charge)) return false;

            let MAX_ATTACKS_ALLOWED_PER_TURN = 1;
            if (v.tags.includes(TAGS.windfury)) {
                MAX_ATTACKS_ALLOWED_PER_TURN = 2;
            }
            //console.log(`${v.name}: atacked ${v.attackedThisTurn} times of ${MAX_ATTACKS_ALLOWED_PER_TURN}`);
            return v.attackedThisTurn < MAX_ATTACKS_ALLOWED_PER_TURN;
        });

        let aubergines = this.$<Cards.Character>('enemy character');
        let sheeps = aubergines.filter(v => {
            return v.isAlive(); // this check is kinda superficial.. as all dead unit MUST be in grave already
        });

        //scan for taunt
        let sheepsTaunt = sheeps.filter(v => v.tags.includes(TAGS.taunt));
        if (sheepsTaunt.length) sheeps = sheepsTaunt;

        // scan for spell shield
        // ..

        let attack = warriors.map(v => {
            return {
                card_id: v.card_id,
                unit: v,
                type: ACTION_TYPES.attack,
                name: v.name,
                //cost: 0, // well.. attacking is free, right ? (only a life of your minion -__-)
                targetList: Array.from(sheeps)
            };
        }).filter(v => v.targetList.length > 0);

        let canSummonMore = (pawns.length <= 7); // with hero
        //console.log('canSummonMore', canSummonMore, pawns.length);

        let playable: Cards.Card[] = this.activePlayer.hand.listPlayable();

        //console.log(playable.map(v => `${v.name} #${v.card_id}`));

        let cards = playable.filter((v) => {
            if (v.type === CARD_TYPES.minion) {
                return canSummonMore;
            }
            if (v.type === CARD_TYPES.spell && !!v.target) {
                //console.log('v.target', v.target);
                return this.$(v.target).length;
            }
            return true;
        }).map(v => {
            return {
                card_id: v.card_id,
                card: v,
                type: ACTION_TYPES.playCard,
                name: v.name,
                cost: v.cost,
                positionList: [0], //this.board.listOwn(this.activePlayer).minions.map((v,i)=>i), //slots between tokens, lol ? //?
                targetList: v.target && this.select(this.activePlayer, v.target)
            };
        });

        //console.log(cards);

        // i'd like options to just be a flat array (of actions), but sometimes i STILL need a debug info
        //console.log('actions --', attack, cards);
        return {
            token: 'GO_GREEN_TODO_IMPLEMENT_ME',
            actions: [
                ...attack,
                ...cards,
                //usePower
                { type: ACTION_TYPES.endTurn },
                { type: ACTION_TYPES.concede }
            ]
        };
    }

    /**
     * First attemp at exporting state
     * Should be:
     * - all entities (all cards + buffs, 1 game, 2 players)
     * - current available options
     * - uid: game + turn + player
     * - revealed state for entities
     * - (?) animations
     *
     * Next step after this is done should be delta update
     */
    exportState() {
        function sanitizeCard(card1: Cards.Card) {
            //console.log(card);
            let card = card1 as Cards.Card & Cards.Character;
            return Object.assign({}, card, {
                owner: card.owner.name, // change it to Player/EntityID

                // resolve getters
                attack: card.attack,
                cost: card.cost,
                health: card.health,
                tags: card.tags
            });
        }

        function neuterTheCard(card: Cards.Card) {
            //console.log(card);
            return {
                card_id: card.card_id
            };
        }

        let options: GameOptions.Options = this.viewAvailableOptions();

        let ggg2 = new GameState();
        const aggregatedState = {
            entities: this.select(this.activePlayer, '*').map(sanitizeCard),
            token: options.token,
            actions: options.actions.map(v => {
                const {
                    type
                } = v;
                switch (v.type) { // TS does not discriminate, it its switch(type) i.e destructured const ..
                    case ACTION_TYPES.concede:
                        return { type };
                    case ACTION_TYPES.endTurn:
                        return { type };
                    case ACTION_TYPES.attack:
                        return {
                            type,
                            card_id: v.card_id,
                            //card: v.card, // unsafe direct reference
                            //unit: v.unit, // unsafe direct reference
                            name: v.name,
                            //cost: 0, // well.. attacking is free, right ? (only a life of your minion -__-)
                            targetList: v.targetList.map(neuterTheCard),
                            // positionList: v.positionList
                        };
                    case ACTION_TYPES.playCard:
                        return {
                            type,
                            card_id: v.card_id,
                            name: v.name,
                            cost: v.cost,
                            targetList: v.targetList && v.targetList.map(neuterTheCard),
                            positionList: v.positionList
                        };
                    default:
                        throw new Error('Unexpected option');
                }
            }),
            game: {
                turn: ggg2.turn,
                //isStarted/isOver should be converted to state:enum
                isStarted: ggg2.isOver,
                isOver: ggg2.isOver,
                activePlayer: { // consider returning players as array
                    name: this.activePlayer.name,
                    mana: this.activePlayer.mana,
                    manaCrystals: this.activePlayer.manaCrystals,
                    //lost:boolean should be converted to state:enum
                    lost: this.activePlayer.lost
                },
                passivePlayer: {
                    name: this.passivePlayer.name,
                    mana: this.passivePlayer.mana,
                    manaCrystals: this.passivePlayer.manaCrystals,
                    lost: this.passivePlayer.lost
                },
            }
        };

        return aggregatedState;
    }
    exportStateJSON(): string {
        const r = this.exportState();
        let outputJSON;
        outputJSON = JSON.stringify(r, function (k, v) {
            if (k === 'eventBus') return undefined;
            if (k === '_listener') return undefined;

            if (k === 'buffs') return undefined;
            if (k === '_by') return undefined;

            return v;
        }, '  ');

        return outputJSON;
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
