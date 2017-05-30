'use strict';
// @ts-check

const combat = require('./combat.js');
const playCard = require('./playCard.js');
const Board = require('./board.js');
const {
  TAGS,
  CARD_TYPES,
  ACTION_TYPES,
  EVENTS
} = require('../data/constants.js');

/**
 * 
 
http://hearthstone.gamepedia.com/GameTag_enumeration

http://hearthstone.gamepedia.com/Step_enumeration
INVALID 0 
BEGIN_FIRST 1 
BEGIN_SHUFFLE 2 
BEGIN_DRAW 3 
BEGIN_MULLIGAN 4 

MAIN_BEGIN 5 MAIN_READY 6 Player tags are reset/incremented (RESOURCES, COMBO_ACTIVE, NUM_CARDS_DRAWN_THIS_TURN, etc) 
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



// g.start();
// g.end();

// g.disconnect();
// g.concede();  

// g.endTurn();

// g.usePower(0); // hero power first suggested target
// g.playCard(0,0); // play first possible card at first target
// g.attack(0,0); // attack with first suggested character first suggested target

// g.viewState();
// g.clone(); // would not be needed when state is immutable ! :)
// g.viewAvailableOptions();
 */
class Game {
  constructor (players, eventBus) {
    this.eventBus = eventBus;

    if (players.length !== 2) throw new RangeError("Game expects two players");
    this.players = players;
    try {
      //console.log(players[0]) ;
      this.board = new Board(players[0].deck._arr, players[1].deck._arr, players[0], players[1]);
    } catch (err) {console.warn(err)}
    this.turn = 0;
    this.activePlayer = this.players[this.turn % 2]; //this is a copypaste
    this.passivePlayer = this.players[(this.turn + 1) % 2]; //this is a copypaste
    
    //this.observableState = {}; // ?
    //this.fullState = {}; // ??? 
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

    return this;  
  }
  concede () {
    this.activePlayer.loose();  
    this.isOver = true;
    
    return this;  
  }
  disconnect () {
    //todo: implement me  
  }
  endTurn () {
    this._onTurnEnd();
    this._onTurnStart();
    this._attemptToDrawCard();
    
    return this;        
  }
  //-- intra turn action --------------
  attack (attacker_idx, target_idx) {
    let o = this.viewAvailableOptions().actions[attacker_idx];

    let a = o.unit;
    let t = o.targetList[target_idx];
    // if Ogre retarget - choose new target :)
    //this._onBeforeAttack(a, t);
    combat(a, t, this);

    return this;
  }  
  playCard (card_idx = 0, position_idx = 0, target_idx = 0) {
    //console.log(`${this.activePlayer.name} tries to play ${card_idx}`);
    let c = this.viewAvailableOptions().actions[card_idx];
    
    if (c.targetList) { // spell:fireball OR minion:battlecry
      var target = c.targetList[target_idx];      
    }
    if (c.positionList) { // minion
      var position = c.positionList[position_idx];
    } 

    let $ = this.board.$.bind(this.board, this.activePlayer);
    let card = c.card;
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
  usePower (target_idx) {
    //todo: implement me

    return this;  
  }  
  _cleanup () {
    //death logic onwards
    let deathrattle_list = [];
    this.board.$(this.activePlayer, 'character').forEach(character => {
      character.isStillAlive();
      if(character.health <= 0) deathrattle_list.push(character);
    });
    
    if (!deathrattle_list.length) {
      return;
    }
    //console.log('death list', deathrattle_list); // was always empty :(( because minions _die() before the sweep
    deathrattle_list.forEach(character => { // can hero have a deathrattle ? o_O //weapon - can.
      //character.buffs.filter(v => v.deathrattle).forEach(v => v.deathrattle(character, board));
      //console.log`deathrattle ${character}`;
      //console.log(character.tags);
      character.tags.filter(tag => !!tag.death).forEach((tag, i) => {
        //console.log('DIE, INSECT!', character.name, tag, i);
        tag.death({
          self: character,
          $: this.board.$.bind(this.board, character.owner),
          game: this
        });
      }, this);   
      if (character._listener) { // remove triggers - super dirty solution...
        console.log(`removed triggers for ${character.card_id}`);
        this.eventBus.removeListener(character._listener[0], character._listener[1]);
        delete character._listener; 
      }
    });
    this._cleanup(); //recursion !
  }
  chooseOption (options_idx = 0, position_idx = 0, target_idx = 0) {
    console.log('-- frame ---');
    let opts = this.viewAvailableOptions().actions;
    if (!opts.length) throw 'options.actions[] are empty' //return;
    
    let o = opts[options_idx];
    if (!o) throw new RangeError('Invalid option index provided.');
    //console.log(o.type);
    if (o.type === ACTION_TYPES.attack) this.attack(options_idx, target_idx);
    if (o.type === ACTION_TYPES.playCard) this.playCard(options_idx, position_idx, target_idx);
    //if (o.type === ACTION_TYPES.usePower) this.usePower(options_idx, target_idx);

    this._cleanup();

    return this;
  }
  /** @deprecated @todo convert to documentation / TS definition */
  _example_viewAvailableOptions () {
    return {
      actions: [
          {id: 'minion1', type: 'ATTACK', name: 'Elf1', targetList: []},
          {id: 'card1', type: 'CARD', name: 'Phyreball', targetList: []},
          {id: 'card2', type: 'CARD', name: 'Elf', positionList: [0,1], targetsList: []}
      ]  
    }    
  }
  /**
   * A nice GOD method
   * @returns {Object} options //options.actions[]<{id, type, name, ?unit, ?cost, ?targetList[], ?positionList[]}>
   */
  viewAvailableOptions () { try {
    //console.log(`refreshing options for ${this.activePlayer.name} on turn#${this.turn}`);
    if (!this.isStarted || this.isOver) {
      console.log('No options are available - game state is wrong.');
      return {
        actions: []
      };
    }
    let $ = this.board.$.bind(this.board, this.activePlayer);
 
    let pawns = $('own character');
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
    
    let aubergines = $('enemy character');
    let sheeps = aubergines.filter(v => {
      return v.health > 0;
    });

    //scan for taunt
    let hasTaunt = sheeps.some(v => v.tags && v.tags.includes(TAGS.taunt));
    if (hasTaunt) sheeps = sheeps.filter(v => v.tags.includes(TAGS.taunt));
    
    // scan for spell shield
    // ..

    //console.log('warriors', warriors);
    //console.log('sheeps', sheeps);
    let attack = warriors.map(v => {
      return {
        id: v._id,
        unit: v,
        type: ACTION_TYPES.attack,
        name: v.name,
        //cost: 0, // well.. attacking is free, right ? (only a life of your minion -__-) 
        targetList: sheeps  
      };
    }).filter(v => v.targetList.length > 0);

    let canSummonMore = (pawns.length <= 7); // with hero
    
    let cards = this.activePlayer.hand.listPlayable().filter((v) =>{
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
        id: v._id,
        card: v,
        type: ACTION_TYPES.playCard,
        name: v.name,
        cost: v.cost,
        positionList: [0], //this.board.listOwn(this.activePlayer).minions.map((v,i)=>i), //slots between tokens, lol ? //?    
        targetList: v.target && $(v.target)
      };
    });

    // i'd like options to just be a flat array (of actions), but sometimes i STILL need a debug info
    //console.log('actions --', attack, cards);
    //this.options = {
    return {    
      actions: [
        ...attack,
        ...cards
      ]
      //, aubergines
    };
  } catch(err) {console.warn.err}}

  //-----------------------------------
  view () {
    console.log(`turn # ${this.turn}: ${this.activePlayer.name}`);
    this.players.forEach(player => {
      console.log(`
player:${player.name} hp❤️:${player.hero.health} mana💎:${player.mana}/${player.manaCrystals} deck:${player.deck.size} hand:${player.hand.size} ${player.hand.list().map(v=>v.name)}`
      );
      //console.log(this.board.$(player, 'own minion').map(v => v.name));
      console.log('minions on board', this.board.$(player, 'own minion').map(v=>
      (v.tags && v.tags.includes(TAGS.taunt) ? '🛡️' : '') +
      (v.tags && v.tags.includes(TAGS.divineShield) ? '🛡' : '') +
      (v.tags.find(v => v.death) ? '☠️' : '') +
      `${v.attack}/${v.health}`
      ));
    });
    
    return this;
  }
}

module.exports = Game;