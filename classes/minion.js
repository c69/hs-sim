'use strict';
// @ts-check

let id = 1;

class Minion { //will extend Character
  constructor ({name, attackPower, health, price, buffs}) {
    this._id = id++;
    this.name = name;
    this.health = health;
    this.attackPower = attackPower;
    this.isReady = false; // initial ZZZ / sleep
    this.attackedThisTurn = 0; // this is getting convoluted =/
    this.buffs = buffs || [];
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
  dealDamage (n) {
    console.log(`🔥 ${this.name} takes ${n} damage!`);
    this.health -= n;
    this.isStillAlive();
  }
  buff (enchantment) {
    this.buffs.push(enchantment); // todo: check for duplicate buffs, etc
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