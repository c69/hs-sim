import combat from './combat';
import mechanics from './mechanics';
import {
  playCard
} from './playCard';
import {
  projectAura
} from './buff';

import { Board } from './board7';
// import { Card } from './card';
import {
  // TAGS,
  CARD_TYPES,
  ACTION_TYPES,
  GameOptions,
  AoC,
  Cards,
  CardDefinition,
  EVENTS,
  EventBus,
  ZONES
} from '../data/constants';

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

type Player = Cards.Player;

export class GameLoop implements GameRPC, GameRunner<GameLoop> {
  eventBus: EventBus;
  board: Board;
  players: Player[];
  activePlayer: Player;
  passivePlayer: Player;

  turn: number = 0;

  // isStarted: boolean = false;
  isOver: boolean = false; // ~ temporary hack
  result: any = null; // ~ temporary hack

  constructor (board: Board, players: [Player, Player], eventBus: any) {
    if (players.length !== 2) throw new RangeError("Game expects two players");

    this.board = board;
    this.players = players;
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
      this.board.draw(player, 5);
      player.manaCrystals = 1;
      player.mana = player.manaCrystals;
    });
  }
  _toggleActivePlayer () {
    this.activePlayer = this.players[this.turn % 2];
    this.passivePlayer = this.players[(this.turn + 1) % 2];

    this.board.activePlayer = this.activePlayer;
    this.board.passivePlayer = this.passivePlayer;
  }
  _onTurnEnd () {
    this.eventBus.emit(EVENTS.turn_ended, {
      target: this.activePlayer
    });
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
    this.board.draw(this.activePlayer, 1);

    //execute triggers: "When player draws a card"
  }

  start () {
    if (this.board.game.isStarted) return this; // multiple chain calls to .start could be ignored
    this.board.game.isStarted = true;
    this.board.game.isOver = false;
    this._init();//maybe with rules ? like min/max mana, etc

    return this;
  }
  end () {

    this.board.game.isOver = true;
    this.board.game.result = {
      //could be a draw, too.. (when turn #87 is reached ?)
      winner: this.activePlayer.lost ? this.passivePlayer : this.activePlayer
    };

    this.isOver = this.board.game.isOver; // temporary hack for main js
    this.result = this.board.game.result; // temporary hack for main js
    return this;
  }
  concede () {
    this.activePlayer.loose();
    this.board.game.isOver = true;

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
    playCard({
      card, // vs "self" - we should standartize on name
      game: this, // do we really need this ?
      $,
      board: this.board,
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

    let allCards = this.board.select(this.activePlayer, '*');
    console.log('== RESET ALL AURA EFFECTS ==');
    allCards.forEach(v => v._effects.incomingAuraEffects = []);

    //refresh/re-apply auras

    allCards.forEach(projector => {
      let auraList = projector._current.auras;
      if (!auraList.length) return;
      // throw `No .auras in computed _current state of ${projector}`;

      if (auraList.length > 1) throw `${projector} has too many auras: ${auraList}`;


      auraList.filter((aura) => {

        const zone = aura.zone || ZONES.play; // move this to apply buff / aura
        const shouldApply = (zone === projector.zone);
        //console.log('emitting aura from', character.name, character.zone, tag);
        return shouldApply;
      })
      .forEach((aura) => {
        //console.log(aura);
        let p = projector.owner;
        let $ = this.board._$(p);

        let t;
        if (aura.target === 'adjacent') {
          t = $<Cards.Character>('own minion').adjacent(projector);
        } else if (/\bother\b/i.test(aura.target)) {
          let selector = aura.target.replace('other', '').trim().replace(/\s+/g, ' ');
          t = $<Cards.Character>(selector).exclude(projector);
        } else if (aura.target === 'self') {
          t = projector;
        } else {
          t = $(aura.target);
        }
        //console.log(`Aura of ${character.name}: ${t.length} of "${aura.target}"`);

        if (!t) return;
        if (Array.isArray(t) && !t.length) return;
        
        console.log(`${projector} projecting ${aura.auraActivated} onto ${t}`);
        projectAura(t, aura.auraActivated);
      });
    });


    //death logic onwards
    const characters = this.board.select<Cards.Character>(this.activePlayer, 'character');
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
      this.board.kill(character);

      let $ = this.board._$(character.owner);
      let self = character;
      let game = this;

      let deathrattles = character._current.deathrattles;
      if (!deathrattles.length) {
        console.log(`${character} has no deathrattle`,
          character._effects,
          character._base,
          character._current
        );
        return;
      }
      deathrattles.forEach((deathObj, i) => {
        console.log(`Deathrattle of ${character}`);
        deathObj.death({
          self,
          $,
          game,
          ...mechanics(self, game, $, this.board)
        });
      });
      if (character._listener) { // remove triggers - super dirty solution...
        console.log(`removed triggers for ${character.card_id}`);
        this.eventBus.removeListener(character._listener[0], character._listener[1]);
        delete character._listener;
      }
    });

    //PHASE: "Aura update: Health/Attack" --  TWICE ? todo: check reference guide
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
    if (this.board.game.isOver) return this; // if game ended - nobody can do anything

    let options: GameOptions.Options = viewAvailableOptions(this.board);

    //if (token !== options.token) throw `security violation - attempt to use wrong token. Expected: [**SECRET**] , got: ${token}`;
    let actions = options.actions;
    if (!actions.length) throw 'options.actions[] are empty'; //return;

    let action = actions[optionIndex];
    if (!action) throw new RangeError('Invalid option index provided.');

    //console.log(action.type);
    switch (action.type) {
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
  view () {
    console.log(`turn # ${this.turn}: ${this.activePlayer.name}`);
    this.players.forEach(p => this.board.viewStateForPlayer(p));

    return this;
  }
}
