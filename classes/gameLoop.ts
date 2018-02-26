import combat from './combat';
import mechanics from './mechanics';
import {
  playCard
} from './playCard';
import {
  buffAura
} from './buff';

import { Board } from './board5';
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
import { exportStateJSON } from './exportState';
import { viewAvailableOptions } from './frameOptions';


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
  // --viewAvailableOptions (): GameOptions.Options;
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

 // could potentially extend Card
export class GameState implements Cards.Card {
  card_id: number;
  name: 'GAME_ENTITY';
  zone: 'PLAY';
  owner: Player = null;
  type: 'GAME';
  tags: Cards.Card['tags'] = [];

  turn: number = 0;

  isStarted: boolean = false;
  isOver: boolean = false;
  result: string = null;
  constructor (a?: any) {}
}
export class GameLoop implements GameRPC, GameRunner<GameLoop> {
  eventBus: any;
  board: Board;

  turn: number = 0;

  players: Player[];
  activePlayer: Player;
  passivePlayer: Player;

  isStarted: boolean = false;
  isOver: boolean = false;
  result: any = null;

  constructor (board: Board, players: [Player, Player], eventBus: any) {
    if (players.length !== 2) throw new RangeError("Game expects two players");
    this.players = players;
    this.board = board;
    this.eventBus = eventBus;

    this.turn = 0;

    this._toggleActivePlayer();
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
  _toggleActivePlayer () {
    this.activePlayer = this.players[this.turn % 2];
    this.passivePlayer = this.players[(this.turn + 1) % 2];

    this.board.activePlayer = this.activePlayer;
    this.board.passivePlayer = this.activePlayer;
  }
  _onTurnEnd () {

    //execute triggers: "At the end of ... turn"
  }
  _onTurnStart () {
    this.turn += 1;

    this._toggleActivePlayer();
    let activePlayer = this.activePlayer;

    if (this.players.some(v => v.hero.health < 1)) {
      return this.end();
    }

    if (activePlayer.manaCrystals < 10) {
      activePlayer.manaCrystals += 1;
    }
    if (activePlayer.mana < 0) throw `Unexpected state: player ${activePlayer.name} has negative mana:${activePlayer.mana}, check code for bugs!`;
    activePlayer.mana = activePlayer.manaCrystals;

    this.board.select(activePlayer, 'own minion').forEach(v => {
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

    let $ = this.board._$(this.activePlayer);
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

    let characters = this.board.select<Cards.Character>(this.activePlayer, 'character');

    let allCards = this.board.select(this.activePlayer, '*');
    console.log('== RESET ALL AURA EFFECTS ==');
    allCards.forEach(v => v.incomingAuras = []);

    //refresh/re-apply auras

    function hasAura (a: any): a is Cards.LegacyBuff {
      return a.aura;
    }
    function hasDeath (a: any): a is Cards.LegacyBuff {
      return a.death;
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
        let $ = this.board._$(p);

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

      let $ = this.board._$(character.owner);
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

    let options: GameOptions.Options = viewAvailableOptions(this.board);

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
  viewAvailableOptions = () => {
    return viewAvailableOptions(this.board);
  };
  exportState = () => {
    return exportStateJSON(this.board);
  }
  //-----------------------------------
  view () {
    console.log(`turn # ${this.turn}: ${this.activePlayer.name}`);
    this.players.forEach(player => {
      let own_minions = this.board.select<Cards.Character>(player, 'own minion');

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
