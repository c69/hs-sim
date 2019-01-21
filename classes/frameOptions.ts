import {
    // ZONES,
    TAGS,
    // PLAYERCLASS,
    // AoC,
    Cards,
    GameOptions,
    ACTION_TYPES,
    CARD_TYPES
} from '../data/constants';
import { Board } from './board7';

type Player = Cards.Player;

/**
 * A nice GOD method
 * @returns {Object} options //options.actions[]<{id, type, name, ?unit, ?cost, ?targetList[], ?positionList[]}>
 */
export function viewAvailableOptions (board: Board): {
    token: string;
    actions: GameOptions.Action[];
} {
    const select = (p: Player, q: string) => board.select(p, q);
    const activePlayer = board.activePlayer;
    const passivePlayer = board.passivePlayer;
    const game = board.game;
    const $ = board._$(activePlayer);

    //console.log(`refreshing options for ${this.activePlayer.name} on turn#${game.turn}`);
    if (!game.isStarted || game.isOver) {
        console.log(`No options are available - game ${game} state is wrong: s ${game.isStarted} | o ${game.isOver}`);
        return {
            token: `${game}:${game.turn}`,
            actions: [] as GameOptions.Action[]
        };
    }

    const pawns = $<Cards.Character>('own character');
    const warriors = pawns.filter(v => {
        if (v.attack < 1) return false;
        if (!v.isReady && !v.tags.includes(TAGS.charge)) return false;
        if (v.tags.includes(TAGS.cannot_attack)) return false;

        let MAX_ATTACKS_ALLOWED_PER_TURN = 1;
        if (v.tags.includes(TAGS.windfury)) {
            MAX_ATTACKS_ALLOWED_PER_TURN = 2;
        }
        //console.log(`${v.name}: atacked ${v.attackedThisTurn} times of ${MAX_ATTACKS_ALLOWED_PER_TURN}`);
        return v.attackedThisTurn < MAX_ATTACKS_ALLOWED_PER_TURN;
    });

    const aubergines = $<Cards.Character>('enemy character');
    let sheeps = aubergines.filter(v => {
        return v.isAlive(); // this check is kinda superficial.. as all dead unit MUST be in grave already
    });

    //scan for taunt
    const sheepsTaunt = sheeps.filter(v => v.tags.includes(TAGS.taunt));
    if (sheepsTaunt.length) sheeps = sheepsTaunt;

    // scan for spell shield
    // ..

    const attack = warriors.map(v => {
        return {
            card_id: v.entity_id,
            unit: v,
            type: ACTION_TYPES.attack,
            name: v.name,
            //cost: 0, // well.. attacking is free, right ? (only a life of your minion -__-)
            targetList: Array.from(sheeps)
        };
    }).filter(v => v.targetList.length > 0);

    const canSummonMore = (pawns.length <= 7); // with hero
    //console.log('canSummonMore', canSummonMore, pawns.length);

    const playable: Cards.PlayableCard[] = board.playableCards(board.activePlayer);

    //console.log(playable.map(v => `${v}`));

    const cards = playable.filter((v) => {
        if (v.type === CARD_TYPES.minion) {
            return canSummonMore;
        }
        if (v.type === CARD_TYPES.spell && !!v.target) {
            //console.log('v.target', v.target);
            return $(v.target).length;
        }
        return true;
    }).map(v => {
        return {
            card_id: v.entity_id,
            card: v,
            type: ACTION_TYPES.playCard,
            name: v.name,
            cost: v.cost,
            positionList: [0], //this.board.listOwn(this.activePlayer).minions.map((v,i)=>i), //slots between tokens, lol ? //?
            targetList: (v.target ? board.select(board.activePlayer, v.target) : []) as Cards.Character[]
        };
    });

    // console.log(cards);

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
