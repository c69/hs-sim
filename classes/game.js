'use strict';
// @ts-check

const Board = require('./board.js');
const TAGS = require('../data/constants.js').TAGS;

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
MAIN_ACTION 10 
MAIN_COMBAT 11 
MAIN_END 12 End of Turn triggers. 
MAIN_NEXT 13 
FINAL_WRAPUP 14 
FINAL_GAMEOVER 15 
MAIN_CLEANUP 16 
MAIN_START_TRIGGERS 17 



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
  constructor (players) {
    if (players.length !== 2) throw new RangeError("Game expects two players");
    this.players = players;
    try {
      //console.log(players[0]) ;
      this.board = new Board(players[0].deck._arr, players[1].deck._arr, players[0], players[1]);
    } catch (err) {console.warn(err)}
    this.turn = 0;
    this.activePlayer = this.players[this.turn % 2]; //this is a copypaste
    this.passivePlayer = this.players[(this.turn + 1) % 2]; //this is a copypaste
    
    this.options = {
      actions: []
    };
    //this.observableState = {}; // ?
    //this.fullState = {}; // ??? 
  }
  _init () {
    //console.log('starting the game...');
    this.players.forEach(player => {
      player.draw(5);
      player.manaCrystals = 1;
      player.mana = player.manaCrystals;

      //player.board = this.board;// temporary hack - wiring
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

    this._refreshAvailableOptions(); // cancer 
    return this;  
  }
  end () {
    this.isOver = true;

    this._refreshAvailableOptions(); // cancer
    return this;  
  }
  concede () {
    this.activePlayer.loose();  
    this.isOver = true;
    
    this._refreshAvailableOptions(); // cancer
    return this;  
  }
  disconnect () {
    //todo: implement me  
  }
  endTurn () {
    this._onTurnEnd();
    this._onTurnStart();
    this._attemptToDrawCard();
    
    this._refreshAvailableOptions(); // cancer 
    return this;        
  }
  usePower (target_idx) {
    //todo: implement me
    this._refreshAvailableOptions(); // cancer  
    return this;  
  }
  attack (attacker_idx, target_idx) {//(1,1) Elf2 -> Zomb1
    let o = this.options.actions[attacker_idx];
    let a = o.unit;
    let t = o.targetList[target_idx];
    // if Ogre retarget - choose new target :)
    //this._onBeforeAttack(a, t);
    this.combat(a, t);

    //this._deathSweep(); // can only happen after action or tirggers
    this._refreshAvailableOptions(); // cancer
    return this;
  }  
  playCard (card_idx = 0, position_idx = 0, target_idx = 0) {
    //console.log(`${this.activePlayer.name} tries to play ${card_idx}`);
    let c = this.options.actions[card_idx];
    
    //console.log('play card', c);
    if (c.targetList) { // spell-fireball OR battlecry
      var target = c.targetList[target_idx];  // if c.t      
    }
    if (c.positionList) { // minion
      var position = c.positionList[position_idx]; // if c.p
    } 
    //console.log('play card', c.name, target, position);
    this.activePlayer.hand.play(c.id)({
      target,
      position,
      $: this.board.$.bind(this.board, this.activePlayer)
    });
    
    //this._onBeforeMinionSummoned(c); //  no no no ...
    //this._summon(c.minion, p); // if minion ? or equip if weapon ?
    //c.play.call(this, c, t); // %-)
    
    //this._onAfterCardPlayed(c);

    //console.log(`${this.activePlayer.name} chosen OPTION ${card_idx}`);

    this._refreshAvailableOptions(); // cancer
    return this;
  }
  _example_viewAvailableOptions () {
    return {
      actions: [
          {id: 'minion1', type: 'ATTACK', name: 'Elf1', targetList: []},
          {id: 'card1', type: 'CARD', name: 'Phyreball', targetList: []},
          {id: 'card2', type: 'CARD', name: 'Elf', positionList: [0,1], targetsList: []}
      ]  
    }    
  }
  viewAvailableOptions () { // why not just access prop directly ? 
    return this.options;  
  } 
  chooseOption (options_idx = 0, position_idx = 0, target_idx = 0) {
    if (!this.options.actions.length) throw 'options.actions are empty' //return;
    let o = this.options.actions[options_idx];
    if (!o) throw new RangeError('Invalid option index provided.');
    //console.log(o.type);
    if (o.type === 'A') this.attack(options_idx, target_idx);
    if (o.type === 'C') this.playCard(options_idx, position_idx, target_idx);

    this._nextTick();
    this._refreshAvailableOptions(); // cancer
    return this;
  }
  _nextTick () {
    let $ = this.board.$.bind(this.board, this.activePlayer);
    //death logic onwards
    let dethrattle_list = [];
    $('character').forEach(character => {
      character.isStillAlive();
      if(character.health <= 0) dethrattle_list.push(character);
    });
    //console.log(dethrattle_list);
    dethrattle_list.forEach(character => { // can hero have a deathrattle ? o_O //weapon - can.
      //character.buffs.filter(v => v.deathrattle).forEach(v => v.deathrattle(character, board));
      //console.log`deathrattle ${character}`;
      character.death && character.death({
        self: character,
        $,
        game: this
      });   
    });
  }
  /**
   *  A nice GOD method
   */
  _refreshAvailableOptions () { try {
    //console.log(`refreshing options for ${this.activePlayer.name} on turn#${this.turn}`);
    if (!this.isStarted || this.isOver) {
      console.log('No options are available - game state is wrong.');
      this.options = {
        actions: []
      };
      return;
    } 
    // board STILL(!) does not provide a way to simply list all (own)units, yet.
    // PROBLEM - hero is not in BOARD yet. because he is legacy class, insted of card 
    let pawns = this.board.$(this.activePlayer, 'own character');
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
    
    let aubergines = this.board.$(this.activePlayer, 'enemy character');
    let sheeps = aubergines
      .concat(this.passivePlayer.hero) // temporary hack, until hero is refactored to be a Card
      .filter(v => {
      return v.health > 0;
    });

    //scan for taunt
    // todo: separate bags for meelee, spell, etc targets - GOD OBJECT CHECKER ORACLE !!!1111
    //let hasTaunt = sheeps.some(v => v.buffs.includes('TAUNT'));
    //if (hasTaunt) sheeps = sheeps.filter(v => v.buffs.includes('TAUNT'));
    let hasTaunt = sheeps.some(v => v.tags && v.tags.includes('TAUNT'));
    if (hasTaunt) sheeps = sheeps.filter(v => v.tags.includes('TAUNT'));
    
    // scan for spell shield
    // ..

    //console.log('warriors', warriors);
    //console.log('sheeps', sheeps);
    let attack = warriors.map(v => {
      return {
        id: v._id,
        unit: v,
        type: 'A', //'attack',
        name: v.name,
        //cost: 0, // well.. attacking is free, right ? (only a life of your minion -__-) 
        targetList: sheeps  
      };
    }).filter(v => v.targetList.length > 0);
    //let mana = this.mana; // hand.listPlayable already checks for mana cost
    let $ = this.board.$.bind(this.board, this.activePlayer);

    let canSummonMore = (pawns.length < 8); // with hero
    
    let cards = this.activePlayer.hand.listPlayable().filter((v) =>{
      if (v.type === 'MINION') {
        return canSummonMore;
      } 
      if (v.type === 'SPELL' && !!v.target) {
        //console.log('v.target', v.target);
        return $(v.target).length;
      }       
      return true;
    } ).map(v=>{
      return {
        id: v.id,
        type: 'C', //'card',
        name: v.name,
        cost: v.cost,
        positionList: [0], //this.board.listOwn(this.activePlayer).minions.map((v,i)=>i), //slots between tokens, lol ? //?    
        targetList: v.target && $(v.target), 
        //targetList: sheeps.reverse() // for battlecry - starts from minions, to help Bob kill taunter Bears )
      };
    });

    // i'd like options to just be a flat array (of actions), but sometimes i STILL need a debug info
    //console.log('actions --', attack, cards);
    this.options = {
      actions: [
        ...attack,
        ...cards
      ]
      //, aubergines
    };
  } catch(err) {console.warn.err}}
  /** 
   * Execute combat action
   * @param {Character} attacker
   * @param {Character} target
   */
  combat (attacker, target) {
    //console.log(`Attacking ${attacker} -> ${target}`);  
    if (!target) throw 'no target'; //return;
    if (target.health < 1) throw 'dead target'; //return;
    if (attacker.health < 1) throw 'dead attacker'; //return;
    if (attacker.owner !== this.activePlayer) throw 'wrong turn'; //return; // is there a way to attack on enemy turn ? - UNGORO:WarriorLegendDino(8)
    if (target.owner === attacker.owner) throw 'own unit'; //return; // will fail for Hunter:Misdirection secret, and Ogres
    if (attacker.tags.includes(TAGS.windfury)) {
      if (attacker.attackedThisTurn > 1) throw 'already attacked too many times this turn'; //return
    } else {
      if (attacker.attackedThisTurn > 0) throw 'already attacked this turn'; //return
    }
    console.log(`⚔️ ${attacker.name}(${attacker.attack}/${attacker.health}) attacks ${target.name}(${target.attack}/${target.health})`);
    //console.log(`🛡️ ${attacker.name} attacks ${target.name}(${target.attack}/${target.health})`);
    
    // this looks like generic Card._damageApply(n)
    [
      [attacker, target.attack],
      [target, attacker.attack]
    ].forEach(([character, dmg]) => character._damageApply(dmg));
    
    attacker.attackedThisTurn += 1;  
        
    //console.log(`⚔️ end----`);
  }
  view () {
    console.log(`turn # ${this.turn}: ${this.activePlayer.name}`);
    this.players.forEach(player => {
      console.log(`
player:${player.name} hp❤️:${player.hero.health} mana💎:${player.mana}/${player.manaCrystals} deck:${player.deck.size} hand:${player.hand.size} ${player.hand.list().map(v=>v.name)}`
      );
      //console.log(this.board.$(player, 'own minion').map(v => v.name));
      console.log('minions on board', this.board.$(player, 'own minion').map(v=>
      `(${v.tags && v.tags.includes('TAUNT') ? '🛡️' : ''}${v.attack}/${v.health})`
      ));
    });
    
    return this;
  }
}

module.exports = Game;