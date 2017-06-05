'use strict';
// @ts-check

const combat = require('./combat.js');
const playCard = require('./playCard.js');
const Board = require('./board.js');
const {
  createCard // temporary - test that summoning from Deathratlle works
} = require('./cardUniverse.js');
const {
  TAGS,
  TAGS_LIST,
  CARD_TYPES,
  ACTION_TYPES,
  EVENTS
} = require('../data/constants.js');

var _frame_count_active = 0;

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

    this.board = new Board(players[0].deck._arr, players[1].deck._arr, players[0], players[1]);
    
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
  }
  endTurn () {
    this._onTurnEnd();
    this._onTurnStart();
    this._attemptToDrawCard();
    
    return this;        
  }
  //-- intra turn action --------------
  attack (actions, attacker_idx, target_idx) {
    let o = actions[attacker_idx];

    let a = o.unit;
    let t = o.targetList[target_idx];
    // if Ogre retarget - choose new target :)
    //this._onBeforeAttack(a, t);
    combat(a, t, this);

    return this;
  }  
  playCard (actions, card_idx = 0, position_idx = 0, target_idx = 0) {
    //console.log(`${this.activePlayer.name} tries to play ${card_idx}`);
    let c = actions[card_idx];
    
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
  usePower (actions, target_idx) {
    //todo: implement me

    return this;  
  }  
  _cleanup () {
    //http://hearthstone.gamepedia.com/Advanced_rulebook#Other_mechanics
    //PHASE: "Aura update: Health/Attack"

    let characters = this.board.$(this.activePlayer, 'character');
    characters.forEach(v => v.auras = []);
    //console.log('== RESET ALL AURA EFFECTS ==');
    //this.view();
    
    //re-apply auras
    characters.filter(character => {
      return character.aura;
    }).forEach(character => {
      let p = character.owner;
      let a = character.aura;
      let $ = this.board.$.bind(this.board, p); 
      //let t = this.board.$(p, a.target)
      let t = $(a.target);

      //the signature is ugly... but i will refactor it
      buff(this, $, character, t, a.buff);  
    });

    //death logic onwards
    let deathrattle_list = characters
    //let deathrattle_list = this.board.$(this.activePlayer, 'character')
      .filter(character => {
        return !character.isAlive();
      });
    
    if (!deathrattle_list.length) {
      return;
    }
    //console.log('death list', deathrattle_list); // was always empty :(( because minions _die() before the sweep
    deathrattle_list.forEach(character => { // can hero have a deathrattle ? o_O //weapon - can.
      //character.buffs.filter(v => v.deathrattle).forEach(v => v.deathrattle(character, board));
      //console.log`deathrattle ${character}`;
      //console.log(character.tags);
      character._die();
      let $ = this.board.$.bind(this.board, character.owner);
      let self = character;
      let game = this;
      character.tags.filter(tag => !!tag.death).forEach((tag, i) => {
        //console.log('DIE, INSECT!', character.name, tag, i);
        tag.death({
          self,
          $,
          game,
          summon (id) {
              console.log(`DEATH.summon: Summonning ${id}`);
              if ($('own minion').length >= 7) return;

              let MY_CREATION = createCard(id, self.owner, game.eventBus);
              self.owner.deck._arr.push(MY_CREATION);
              MY_CREATION._summon();
              //console.log('its real!!!', MY_CREATION);
          },
          draw (n) {
              console.log(`DEATH: try to draw ${n}cards`);
              self.owner.draw(n);
          }
        });
      }, this);   
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
  chooseOption (options_idx = 0, position_idx = 0, target_idx = 0) {
    _frame_count_active += 1;

    console.log('-- frame ---');
    let opts = this.viewAvailableOptions().actions;
    if (!opts.length) throw 'options.actions[] are empty' //return;
    
    let o = opts[options_idx];
    if (!o) throw new RangeError('Invalid option index provided.');
    //console.log(o.type);
    if (o.type === ACTION_TYPES.attack) this.attack(opts, options_idx, target_idx);
    if (o.type === ACTION_TYPES.playCard) this.playCard(opts, options_idx, position_idx, target_idx);
    //if (o.type === ACTION_TYPES.usePower) this.usePower(opts, options_idx, target_idx);

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
  viewAvailableOptions () {
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
  }

  //-----------------------------------
  view () {
    console.log(`turn # ${this.turn}: ${this.activePlayer.name}`);
    this.players.forEach(player => {
      let own_minions = this.board.$(player, 'own minion');
      
      //console.log(own_minions.map(({buffs, auras, tags}) => {return {buffs, auras, tags}} ))
      
      if (own_minions.length > 7) throw 'Invalid state: more that 7 minions on board.';

      console.log(`
player:${player.name} hp❤️:${player.hero.health} mana💎:${player.mana}/${player.manaCrystals} deck:${player.deck.size} hand:${player.hand.size} ${player.hand.list().map(v=>v.name)}`
      );
      //console.log(this.board.$(player, 'own minion').map(v => v.name));
      console.log('minions on board', own_minions.map(v=>
      (v.tags && v.tags.includes(TAGS.taunt) ? '🛡️' : '') +
      (v.tags && v.tags.includes(TAGS.divineShield) ? '🛡' : '') +
      (v.tags && v.tags.includes(TAGS.windfury) ? 'w' : '') +
      (v.tags.find(v => v.death) ? '☠️' : '') +
      (v.tags.find(v => v.type === CARD_TYPES.enchantments) ? 'E' : '') +
      (v.auras.length ? 'A' : '') +

      `${v.attack}/${v.health}`
      ));
    });
    
    return this;
  }
}

// move this away
function buff (game, $, char, x, id_or_Tag) {
    if (!x) throw new RangeError('No target provided for buff');
    if (!id_or_Tag) throw new RangeError('No Buff/Tag provided');

    let x2 = Array.isArray(x) ? x : [x]; 
    x2.forEach(v => {
        if (TAGS_LIST.includes(id_or_Tag)) {
            v.auras.push(id_or_Tag); // check for duplicates
        } else {
            createCard(id_or_Tag, char.owner, game.eventBus)
            .apply({
              target: v,
              $,
              game,
              type: 'aura'
            });
        }
    });
    return x;
}

module.exports = Game;