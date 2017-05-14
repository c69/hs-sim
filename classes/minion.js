'use strict';
// @ts-check

let id = 1;

class Minion { //will extend Character
  constructor ({name, attackPower, health, price}) {
    this._id = id++;
    this.name = name;
    this.health = health;
    this.attackPower = attackPower;
    this.isWaiting = true; // initial ZZZ / sleep
    this.attackedThisTurn = 0; // this is getting convoluted =/
    this.owner = null; // maybe init Minion with owner upon creation ?

    // this.tribe = "";

    //TODO: move all silenceable stuff to Buff object
    // this.battleCry = [];
    // this.deathrattle = [];
    // this.inspire = [];
    // this.effect = []; //trigger-condition-action
    // this.buff = [];

    // this.taunt = false;
    // this.charge = false;
    // this.spellShield = false;
    // this.immune = false;
    // this.poisonous = false;
    //-? this.isEnraged = false;
    //-? this.canAttackHeroesWithCharge = false; //lesserCharge
    // this.divineShield = false;
    // this.windFury = false;
    // this.megaWindFury = false;
    
    // this.isSilenced = false;
  } 
  damage (n) {
    this.health -= n;
    this.isStillAlive();
  }
  isStillAlive() {
    if (this.health < 1) this.die();
  }
  die () {
    console.log(`☠️ minion died: ${this.owner.name}'s ${this.name}`)
  }
  toString () {
    return `[Object Minion: ${this.name}#${this._id}]`;
  }
}

module.exports = Minion;