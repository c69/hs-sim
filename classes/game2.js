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
    let o = this.options.attack[attacker_idx];
    let a = o.id;
    let t = o.targetList[target_idx];
    // if Ogre retarget - choose new target :)
    //this._onBeforeAttack(a, t);
    this._attack(a, t);

    //this._deathSweep(); // can only happen after action or tirggers
    this._refreshAvailableOptions(); // cancer
    return this;
  }  
  playCard (card_idx = 0, position_idx = 0, target_idx = 0) {
    console.log(`${this.activePlayer.name} tries to play ${card_idx}`);
    let c = this.options.play[card_idx];
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

    console.log(`${this.activePlayer.name} PLAYED ${card_idx}`);

    this._refreshAvailableOptions(); // cancer
    return this;
  }
  _example_viewAvailableOptions () {
    return {
      attack: [
        {aggressor: Elf1, targets: [Bob, Zomb1, Zomb2]},
        {a: Elf2, t: [Bob, Zomb1, Zomb2]}
      ],
      power: [Alice, Bob, Elf1, Elf2, Zomb1, Zomb2],
      play: [
        {a: Firebal, t: [Alice, Bob, Elf1, Elf2, Zomb1, Zomb2]},
        {a: Elf3, p: [0,1,2]},
        {a: Archer, p: [0,1,2], t: [Alice, Bob, Elf1, Elf2, Zomb1, Zomb2]},
      ]  
    }    
  }
  viewAvailableOptions () { // why not just access prop directly ? 
    return this.options;  
  } 
  /**
   *  A nice GOD method
   */
  _refreshAvailableOptions () {
    if (!this.isStarted || this.isOver) this.options = {};
    
    // board does not proide a way to simply list all (own)units, yet.
    let pawns = this.board.listOwn(this.activePlayer);
    let warriors = [].concat(pawns.hero, pawns.minions).filter(v => {
      return v.attackPower > 0;// && !v.attackedThisTurn;
    });

    let aubergines = this.board.listOwn(this.passivePlayer);
    let sheeps = [].concat(aubergines.hero, aubergines.minions).filter(v => {
      return true;
    });
    //scan for taunt, scan for spell shield

    let attack = warriors.map(v => {
      return {
        id: v._id, 
        targetList: sheeps  
      };
    });
    //let mana = this.mana; // hand.listPlayable already checks for mana cost
    let cards = this.activePlayer.hand.listPlayable().map(v=>{
      return v.name === 'Fireball' ? {
        id: v.id,
        targetList: [this.activePlayer.hero] // humor: let only attack own hero with Fireball. Refactor with selectors. 
      } : {
        id: v.id,
        positionList: [0] //this.board.listOwn(this.activePlayer).minions.map((v,i)=>i), //slots between tokens, lol ? //?    
        //targetList: [this.activePlayer.hero]
      };
    });

    this.options = {
      attack,
      play: cards,
      aubergines
    };
  }
  /** 
   * Execute combat action
   * @param {Character} attacker
   * @param {Character} target
   */
  _attack (attacker, target) {
    if (!target) return;
    if (target.health < 1) return;
    if (attacker.health < 1) return;
    if (attacker.owner !== this.activePlayer) return; // is there a way to attack on enemy turn ? - UNGORO:WarriorLegendDino(8)
    if (target.owner === attacker.owner) return; // will fail for Hunter:Misdirection secret, and Ogres

    console.log(`⚔️ ${attacker.name}(${attacker.attackPower}/${attacker.health}) attacks ${target.name}(${target.attackPower}/${target.health})`);
    //console.log(`🛡️ ${attacker.name} attacks ${target.name}(${target.attackPower}/${target.health})`);
    //ignore shields, etc for now
    target.health -= attacker.attackPower;
    attacker.health -= target.attackPower;  
    target.isStillAlive();
    attacker.isStillAlive();  
  }
  view () {
    console.log(`turn # ${this.turn}: ${this.activePlayer.name}`);
    this.players.forEach(player => {
      console.log(`
player:${player.name} hp❤️:${player.hero.hp} mana💎:${player.mana}/${player.manaCrystals} deck:${player.deck.size} hand:${player.hand.size} ${player.hand.list().map(v=>v.name)}`
      );
      console.log('minions on board', this.board.listOwn(player).minions.map(v=>`(${v.attackPower}/${v.health})`));
    });
    
    return this;
  }
}

module.exports = Game;