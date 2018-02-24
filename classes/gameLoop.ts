import combat from './combat';
import mechanics from './mechanics';
import {
  playCard
} from './playCard';
import {
  buffAura
} from './buff';

import { Board, ArrayOfCards } from './board2';
import { Card } from './card';
import {
  TAGS,
  CARD_TYPES,
  ACTION_TYPES,
  GameOptions,
  AoC,
  Cards,
  CardDefinition,
  EVENTS,
  ZONES
} from '../data/constants';
import Player from './player';

type FluentMethod<T> = () => T;
type ActionCoordinates = {
  targetIndex: number;
  positionIndex: number;
}
interface GameRunner<G> {
  start (): G;
  _onTurnStart(): G;
  end (): G;
  disconnect (): G;
  concede (): G;
  endTurn (): G;

  // usePower (0) hero power first suggested target
  usePower (action: GameOptions.Action, o: ActionCoordinates): G;
  // playCard (0,0) - to play first possible card at first target
  playCard (action: GameOptions.Play, o: ActionCoordinates): G;
  // attack(0,0) to attack with first suggested character first suggested target
  attack (action: GameOptions.Attack, o: ActionCoordinates): G;

// g.viewState();
// g.clone(); // would not be needed when state is immutable ! :)
  viewAvailableOptions (): GameOptions.Options;
}

interface GameRPC {
  exportState (): string; // LOL - typesafety at its finest =_=
  chooseOption (token: string, option: {
    optionIndex?: number;
    positionIndex?: number;
    targetIndex?: number;
  }): any;
};

var _frame_count_active = 0;

/*
 *

http://hearthstone.gamepedia.com/GameTag_enumeration

http://hearthstone.gamepedia.com/Step_enumeration
INVALID 0
BEGIN_FIRST 1
BEGIN_SHUFFLE 2
BEGIN_DRAW 3
BEGIN_MULLIGAN 4

MAIN_BEGIN 5
MAIN_READY 6 Player tags are reset/incremented (RESOURCES, COMBO_ACTIVE, NUM_CARDS_DRAWN_THIS_TURN, etc)
MAIN_RESOURCE 7
MAIN_DRAW 8
MAIN_START 9
? MAIN_START_TRIGGERS 17

MAIN_ACTION 10
MAIN_COMBAT 11
? MAIN_CLEANUP 16

MAIN_END 12 End of Turn triggers.
MAIN_NEXT 13

FINAL_WRAPUP 14
FINAL_GAMEOVER 15

 */
class Game implements GameRPC, GameRunner<Game> {
  eventBus: any;
  players: Player[];
  board: Board;
  _$: Map<Player, (a: string) => AoC>;
  // _$: Map<any, (a: string) => ArrayOfCards>;
  turn: number = 0;
  activePlayer: Player;
  passivePlayer: Player;
  isStarted: boolean = false;
  isOver: boolean = false;
  result: any = null;

  constructor (players: any[], eventBus: any) {
    this.eventBus = eventBus;

    if (players.length !== 2) throw new RangeError("Game expects two players");
    this.players = players;

    this.board = new Board(players[0].deck._arr, players[1].deck._arr, players[0], players[1]);

    // save the bound $ function, and do not recreate them every tick
    let $p1 = this.board.$.bind(this.board, players[0]);
    let $p2 = this.board.$.bind(this.board, players[1]);
    this._$ = new Map();
    this._$.set(players[0], $p1);
    this._$.set(players[1], $p2);

    this.turn = 0;
    this.activePlayer = this.players[this.turn % 2]; //this is a copypaste
    this.passivePlayer = this.players[(this.turn + 1) % 2]; //this is a copypaste

    //this.observableState = {}; // ?
    //this.fullState = {}; // ???
  }
  static _profile () {
    return {
      _frame_count_active
    };
  }
  _init () {
    //console.log('starting the game...');
    this.players.forEach(player => {
      player.draw(5);
      player.manaCrystals = 1;
      player.mana = player.manaCrystals;
    });

  }
  _onTurnEnd () {

    //execute triggers: "At the end of ... turn"
  }
  _onTurnStart () {
    this.turn += 1;

    let activePlayer = this.players[this.turn % 2];
    this.activePlayer = activePlayer;
    this.passivePlayer = this.players[(this.turn + 1) % 2];

    if (this.players.some(v => v.hero.health < 1)) {
      return this.end();
    }

    if (activePlayer.manaCrystals < 10) {
      activePlayer.manaCrystals += 1;
    }
    if (activePlayer.mana < 0) throw `Unexpected state: player ${activePlayer.name} has negative mana:${activePlayer.mana}, check code for bugs!`;
    activePlayer.mana = activePlayer.manaCrystals;

    this.board.$(this.activePlayer, 'own minion').forEach(v => {
      v.attackedThisTurn = 0; // invasively reset attack counters
      v.isReady = true;
    });
    //execute triggers: "At the beginning of ... turn"
    this.eventBus.emit(EVENTS.turn_started, {
      target: this.activePlayer
    });
    this._cleanup(); // cancer great again ? :/
  }
  _attemptToDrawCard () { // wrappers inside of wrappers ...
    this.activePlayer.draw(1);

    //execute triggers: "When player draws a card"
  }

  start () {
    if (this.isStarted) return this; // multiple chain calls to .start could be ignored
    this.isStarted = true;
    this.isOver = false;
    this._init();//maybe with rules ? like min/max mana, etc

    return this;
  }
  end () {
    this.isOver = true;
    this.result = {
      //could be a draw, too.. (when turn #87 is reached ?)
      winner: this.activePlayer.lost ? this.passivePlayer : this.activePlayer
    };
    return this;
  }
  concede () {
    this.activePlayer.loose();
    this.isOver = true;

    return this;
  }
  disconnect () {
    //todo: implement me
    return this;
  }
  endTurn () {
    this._onTurnEnd();
    this._onTurnStart();
    this._attemptToDrawCard();

    return this;
  }
  //-- intra turn action --------------
  attack (o: GameOptions.Attack, {targetIndex = 0}) {
    let a = o.unit;
    let t = o.targetList[targetIndex];
    // if Ogre retarget - choose new target :)
    //this._onBeforeAttack(a, t);
    combat(a, t, this);

    return this;
  }
  playCard (o: GameOptions.Play, {positionIndex = 0, targetIndex = 0}) {
    if (o.targetList) { // spell:fireball OR minion:battlecry
      var target = o.targetList[targetIndex];
    }
    if (o.positionList) { // minion
      var position = o.positionList[positionIndex];
    }

    let $ = this._$.get(this.activePlayer);
    let card = o.card;
    //console.log('play card', c.name, target, position);
    playCard(card, {
      game: this,
      $,
      target,
      position
    });

    this.eventBus.emit(EVENTS.card_played, card);

    return this;
  }
  usePower (o: GameOptions.Action,  {targetIndex = 0}) {
    //todo: implement me

    return this;
  }
  /**
   * @returns {this.cleanup()|void} recursive call, if ANY minion dies
   */
  _cleanup () {
    //http://hearthstone.gamepedia.com/Advanced_rulebook#Other_mechanics
    //PHASE: "Aura update: Health/Attack"

    let characters = this.board.$<Cards.Character>(this.activePlayer, 'character');

    let allCards = this.board.$(this.activePlayer, '*');
    console.log('== RESET ALL AURA EFFECTS ==');
    allCards.forEach(v => v.incomingAuras = []);

    //refresh/re-apply auras

    function hasAura (a: any): a is Cards.LegacyBuff {
      return 'aura' in a;
    }
    function hasDeath (a: any): a is Cards.LegacyBuff {
      return 'death' in a;
    }

    allCards.forEach(character => {
      character.tags.filter((tag) => {
        //return true; // [broken?] hack to ignore aura checking code

        if (!hasAura(tag)) return false;

        const zone = tag.aura.zone || ZONES.play; // move this to apply buff / aura
        const shouldApply = (zone === character.zone);
        //console.log('emitting aura from', character.name, character.zone, tag);
        return shouldApply;
      })
      .forEach(({aura}: Cards.LegacyBuff) => {
        //console.log(aura);
        let p = character.owner;
        let $ = this._$.get(p);

        let t;
        if (aura.target === 'self') {
          t = character;
        } else if (aura.target === 'adjacent') {
          t = $('own minion').adjacent(character);
        } else if (/\bother\b/i.test(aura.target)) {
          let selector = aura.target.replace('other', '').trim().replace(/\s+/g, ' ');
          t = $(selector).exclude(character);
        } else {
          t = $(aura.target);
        }
        //console.log(`Aura of ${character.name}: ${t.length} of "${aura.target}"`);

        //the signature is ugly... but i will refactor it
        buffAura(this, $, character, t, aura.buff);
      });
    });


    //death logic onwards
    let death_list = characters.filter(character => {
        return !character.isAlive();
      });

    if (!death_list.length) {
      return;
    }
    death_list.forEach(character => { // can hero have a deathrattle ? o_O //weapon - can.
      //~> character.buffs.filter(v => v.deathrattle).forEach(v => v.deathrattle(character, board));
      //console.log`deathrattle ${character}`;
      //console.log(character.tags);
      character._die();

      let $ = this._$.get(character.owner);
      let self = character;
      let game = this;
      character.tags.filter(tag => hasDeath(tag)).filter(v => v).forEach((tag, i) => {
        if (!hasDeath(tag)) return false; // TS does not activate inferrence without this line...

        (tag.death as CardDefinition['death'])({
          self,
          $,
          game,
          ...mechanics(self, game, $)
        });
      });
      if (character._listener) { // remove triggers - super dirty solution...
        console.log(`removed triggers for ${character.card_id}`);
        this.eventBus.removeListener(character._listener[0], character._listener[1]);
        delete character._listener;
      }
    });

    //PHASE: "Aura update: Health/Attack"
    //Mal'Ganis, Baron Riverdale, Auchenai Soulpriest, Brann Bronzebeard, (Spiritsinger Umbra ?)

    this._cleanup(); //recursion !
  }
  /**
   * Choose option and sub-options for next action
   * @param {string} token_idx
   * @param {Object} optionsChosen
   * @config {number} optionIndex
   * @config {number} positionIndex
   * @config {number} targetIndex
   */
  chooseOption (token = '', {
    optionIndex = 0,
    // suboptionIndex = 0,
    positionIndex = 0,
    targetIndex = 0
  } = {}) {
    _frame_count_active += 1;

    console.log('-- frame: MAIN_ACTION ---');
    if (this.isOver) return this; // if game ended - nobody can do anything

    let options: GameOptions.Options = this.viewAvailableOptions();
    //if (token !== options.token) throw `security violation - attempt to use wrong token. Expected: [**SECRET**] , got: ${token}`;
    let actions = options.actions;
    if (!actions.length) throw 'options.actions[] are empty'; //return;

    let action = actions[optionIndex];
    if (!action) throw new RangeError('Invalid option index provided.');

    //console.log(action.type);
    switch (action.type) {
      // case ACTION_TYPES.attack:
      case ACTION_TYPES.attack:
        // console.log('choose: ATTACK', action);
        this.attack(action, {targetIndex});
        break;
      case ACTION_TYPES.playCard:
        // console.log('choose: PLAY CARD', action);
        this.playCard(action, {positionIndex, targetIndex});
        break;
      // case ACTION_TYPES.usePower:
      //   this.usePower(actions, optionIndex, targetIndex);
      //   break;
      case ACTION_TYPES.endTurn:
        console.log('choose: NEXT_TURN', action);
        this.endTurn();
        break;
      case ACTION_TYPES.concede:
        console.log('choose: :(', action);
        this.concede();
        break;
      default:
        throw new RangeError('Unexpected action type');
    }

    this._cleanup();

    return this;
  }
  /**
   * A nice GOD method
   * @returns {Object} options //options.actions[]<{id, type, name, ?unit, ?cost, ?targetList[], ?positionList[]}>
   */
  viewAvailableOptions () {
    //console.log(`refreshing options for ${this.activePlayer.name} on turn#${this.turn}`);
    if (!this.isStarted || this.isOver) {
      console.log('No options are available - game state is wrong.');
      return {
        actions: [] as GameOptions.Action[]
      };
    }
    let $ = this._$.get(this.activePlayer);

    let pawns = $('own character') as AoC<Cards.Character>;
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

    let aubergines = $('enemy character') as AoC<Cards.Character>;
    let sheeps = aubergines.filter(v => {
      return v.isAlive(); // this check is kinda superficial.. as all dead unit MUST be in grave already
    });

    //scan for taunt
    let sheepsTaunt = sheeps.filter(v => v.tags.includes(TAGS.taunt));
    if (sheepsTaunt.length) sheeps = sheepsTaunt;

    // scan for spell shield
    // ..

    //console.log('warriors', warriors);
    //console.log('sheeps', sheeps);
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

    let cards = playable.filter((v) =>{
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
        card_id: v.card_id,
        card: v,
        type: ACTION_TYPES.playCard,
        name: v.name,
        cost: v.cost,
        positionList: [0], //this.board.listOwn(this.activePlayer).minions.map((v,i)=>i), //slots between tokens, lol ? //?
        targetList: v.target && Array.from($(v.target))
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
        {type: ACTION_TYPES.endTurn},
        {type: ACTION_TYPES.concede}
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
  exportState () {
    function sanitizeCard (card1: Cards.Card) {
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

    function onlyLeaveInCardObject (card: Cards.Card) {
      //console.log(card);
      return {
        card_id: card.card_id
      };
    }

    let options: GameOptions.Options = this.viewAvailableOptions();

    let aggregatedState = {
      entities: this.board.$(this.activePlayer, '*').map(sanitizeCard),
      token: options.token,
      actions: options.actions.map(v => {
        const {
          type
        } = v;
        switch (v.type) { // TS does not discriminate, it its switch(type) i.e destructured const ..
          case ACTION_TYPES.concede:
          return {type};
          case ACTION_TYPES.endTurn:
          return {type};
          case ACTION_TYPES.attack:
          return {
            type,
            card_id: v.card_id,
            //card: v.card, // unsafe direct reference
            //unit: v.unit, // unsafe direct reference
            name: v.name,
            //cost: 0, // well.. attacking is free, right ? (only a life of your minion -__-)
            targetList: v.targetList,
            // positionList: v.positionList
          };
          case ACTION_TYPES.playCard:
          return {
            type,
            card_id: v.card_id,
            name: v.name,
            cost: v.cost,
            targetList: v.targetList,
            positionList: v.positionList
          };
          default:
          throw new Error('Unexpected option');
        }
      }),
      game: {
        turn: this.turn,
        //isStarted/isOver should be converted to state:enum
        isStarted: this.isOver,
        isOver: this.isOver,
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

    let outputJSON;
    outputJSON = JSON.stringify(aggregatedState, function (k,v) {
        if (k === 'eventBus') return undefined;
        if (k === '_listener') return undefined;

        if (k === 'buffs') return undefined;
        if (k === '_by') return undefined;

        return v;
      }, '  ');

    return outputJSON;
  }
  //-----------------------------------
  view () {
    console.log(`turn # ${this.turn}: ${this.activePlayer.name}`);
    this.players.forEach(player => {
      let own_minions = this.board.$<Cards.Character>(player, 'own minion');

      //console.log(own_minions.map(({buffs, incomingAuras, tags}) => {return {buffs, incomingAuras, tags}} ))

      if (own_minions.length > 7) throw 'Invalid state: more that 7 minions on board.';

      console.log(`
player:${player.name} hp❤️:${player.hero.health} mana💎:${player.mana}/${player.manaCrystals} deck:${player.deck.size} hand:${player.hand.size} ${player.hand.list().map(v=>v.cost +') ' + v.name)}`
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
    });

    return this;
  }
}

export {
  Game
};
