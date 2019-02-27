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
import { Board } from './board7';
import { viewAvailableOptions } from './frameOptions';

// have to alias, becase namespaced types are not inferring correctly
type Player = Cards.Player;
type Card = Cards.Card;
type Entity = Cards.Card;

function sanitizeEntity(entity: Entity | Card) {
    // console.log(entity);
    if (entity.type === CARD_TYPES.game || entity.type === CARD_TYPES.player) {
        return entity;
    }
    return Object.assign({}, entity, {
        owner: entity.owner.entity_id,

        // resolve getters
        attack: entity.attack,
        cost: entity.cost,
        health: entity.health,
        tags: entity.tags
    });
}

function neuterTheCard (card: Cards.Card) {
    //console.log(card);
    return {
        card_id: card.entity_id
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
export function exportState (board: Board) {
    if (!board) throw 'Cannot export state of: ' + board;

    const select = (p: Player, q: string) => board.select(p, q);
    const activePlayer = board.activePlayer;
    const passivePlayer = board.passivePlayer;
    const game = board.game;

    const options: GameOptions.Options = viewAvailableOptions(board);

    const aggregatedState = {
        entities: select(activePlayer, '*').map(sanitizeEntity),
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
            turn: game.turn,
            //isStarted/isOver should be converted to state:enum
            isStarted: game.isStarted,
            isOver: game.isOver,
            activePlayer: { // consider returning players as array
                name: activePlayer.name,
                mana: activePlayer.mana,
                manaCrystals: activePlayer.manaCrystals,
                //lost:boolean should be converted to state:enum
                lost: activePlayer.lost
            },
            passivePlayer: {
                name: passivePlayer.name,
                mana: passivePlayer.mana,
                manaCrystals: passivePlayer.manaCrystals,
                lost: passivePlayer.lost
            },
        }
    };

    return aggregatedState;
}

export function exportStateJSON (board: Board): string {
    const r = exportState(board);
    let outputJSON;
    outputJSON = JSON.stringify(r, (k, v) => {
        if (k === 'eventBus') return undefined;
        if (k === '_listener') return undefined;

        if (k === 'buffs') return undefined;
        if (k === '_by') return undefined;

        return v;
    }, '  ');

    return outputJSON;
}
