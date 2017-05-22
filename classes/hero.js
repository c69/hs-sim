'use strict';
// @ts-check

let id = -1;

class Hero {
  constructor (player) {
    // hack: just random ID guaranteed not to collide with auto-increment on minions
    // does not matter because heroes cannot attack just yet
    // and this will all be refactored anyway 
    this._id = id--;
    
    this.name = player.name; // yes, technically - "Guldan" != "CutePumkin312"
    this.health = 30;
    this.attack = 0;
    this.tags = [];
    this.buffs = [];
    this.owner = player;
  }
  get hp () {
    return this.health;
  }
  dealDamage (n) {
      console.log(`🔥 ${this.name} takes ${n} damage!`);
      this.health -= n; // replace with damage buff
      this.isStillAlive();
  }
  dealDamageSpell (n) {
      console.log(`🔥 ${this.name} takes ${n} spell damage!`);
      this.health -= n; // replace with damage buff
      this.isStillAlive();
  }
  isStillAlive() {
    if (this.health < 1) this.die();
  }
  die () {
    console.warn(`hero died`);
    this.owner.loose();
  }
  toString () {
    return `[Object Hero: ${this.name}]`;
  }
}

module.exports = Hero;