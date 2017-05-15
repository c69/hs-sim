'use strict';
// @ts-check

const Board = require('./board.js');

/**
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
    this.board = new Board(players[0], players[1]);
    this.turn = 0;
    this.activePlayer = this.players[this.turn % 2]; //this is a copypaste
    this.passivePlayer = this.players[(this.turn + 1) % 2]; //this is a copypaste
    
    this.options = {};
    //this.observableState = {}; // ?
    //this.fullState = {}; // ??? 
  }
  _init () {
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

    this.board.listOwn(this.activePlayer).minions.forEach(v => {
      v.attackedThisTurn = 0; // invasively reset attack counters 
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
    this._attack(a, t);

    //this._deathSweep(); // can only happen after action or tirggers
    this._refreshAvailableOptions(); // cancer
    return this;
  }  
  playCard (card_idx = 0, position_idx = 0, target_idx = 0) {
    //console.log(`${this.activePlayer.name} tries to play ${card_idx}`);
    let c = this.options.actions[card_idx];
    
    if (c.positionList) { // minion
      var position = c.positionList[position_idx]; // if c.p
      this.activePlayer.hand.play(c.id)(this.activePlayer, this.board);    
    }
    if (c.targetList) { // spell-fireball
      let target = c.targetList[target_idx];  // if c.t
      this.activePlayer.hand.play(c.id)(target);    
    }
    
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

    this._refreshAvailableOptions(); // cancer
    return this;
  }
  /**
   *  A nice GOD method
   */
  _refreshAvailableOptions () {
    //console.log(`refreshing options for ${this.activePlayer.name} on turn#${this.turn}`);
    if (!this.isStarted || this.isOver) {
      this.options = {actions:[]};
      return;
    } 
    // board does not provide a way to simply list all (own)units, yet.
    let pawns = this.board.listOwn(this.activePlayer);
    let warriors = [].concat(pawns.hero, pawns.minions).filter(v => {
      return v.attackPower > 0 && v.attackedThisTurn < 1;
    });

    let aubergines = this.board.listOwn(this.passivePlayer);
    let sheeps = [].concat(aubergines.hero, aubergines.minions).filter(v => {
      return v.health > 0;
    });

    //scan for taunt
    // todo: separate bags for meelee, spell, etc targets - GOD OBJECT CHECKER ORACLE !!!1111
    let hasTaunt = sheeps.some(v => v.buffs.includes('TAUNT'));
    if (hasTaunt) sheeps = sheeps.filter(v => v.buffs.includes('TAUNT'));
    
    // scan for spell shield
    // ..

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
    let cards = this.activePlayer.hand.listPlayable().map(v=>{
      return v.name === 'Fireball' ? {
        id: v.id,
        type: 'C', //'card',
        name: v.name,
        //cost: v.price,
        targetList: [this.passivePlayer.hero] // your face!!! //todo: Refactor with selectors. 
      } : {
        id: v.id,
        type: 'C', //'card',
        name: v.name,
        //cost: v.price,
        positionList: [0] //this.board.listOwn(this.activePlayer).minions.map((v,i)=>i), //slots between tokens, lol ? //?    
        //targetList: [this.activePlayer.hero] // required for Archer
      };
    });

    // i'd like options to just be a flat array (of actions), but sometimes i STILL need a debug info
    this.options = {
      actions : [
        ...attack,
        ...cards
      ]
      //, aubergines
    };
  }
  /** 
   * Execute combat action
   * @param {Character} attacker
   * @param {Character} target
   */
  _attack (attacker, target) {
    //console.log(`Attacking ${attacker} -> ${target}`);  
    if (!target) throw 'no target'; //return;
    if (target.health < 1) throw 'dead target'; //return;
    if (attacker.health < 1) throw 'dead attacker'; //return;
    if (attacker.owner !== this.activePlayer) throw 'wrong turn'; //return; // is there a way to attack on enemy turn ? - UNGORO:WarriorLegendDino(8)
    if (target.owner === attacker.owner) throw 'own unit'; //return; // will fail for Hunter:Misdirection secret, and Ogres
    if (attacker.attackedThisTurn > 0) throw 'already attacked this turn'; //return

    console.log(`⚔️ ${attacker.name}(${attacker.attackPower}/${attacker.health}) attacks ${target.name}(${target.attackPower}/${target.health})`);
    //console.log(`🛡️ ${attacker.name} attacks ${target.name}(${target.attackPower}/${target.health})`);
    //ignore shields, etc for now
    target.health -= attacker.attackPower;
    attacker.health -= target.attackPower;
    attacker.attackedThisTurn += 1;  
    target.isStillAlive();
    attacker.isStillAlive();  
  }
  view () {
    console.log(`turn # ${this.turn}: ${this.activePlayer.name}`);
    this.players.forEach(player => {
      console.log(`
player:${player.name} hp❤️:${player.hero.hp} mana💎:${player.mana}/${player.manaCrystals} deck:${player.deck.size} hand:${player.hand.size} ${player.hand.list().map(v=>v.name)}`
      );
      console.log('minions on board', this.board.listOwn(player).minions.map(v=>
      `(${v.buffs.includes('TAUNT') ? '🛡️' : ''}${v.attackPower}/${v.health})`
      ));
    });
    
    return this;
  }
}

module.exports = Game;