'use strict';
// @ts-check

class Hero {
  constructor (player) {
    this.name = player.name; // yes, technically - "Guldan" != "CutePumkin312"
    this.health = 30;
    this.attackPower = 0;
    this.owner = player;
  }
  get hp () {
    return this.health;
  }
  defend (attacker) {
    console.log(`${attacker.name} attacks ${this.name}`);
    //ignore shields, etc for now
    this.health -= attacker.attackPower;
    attacker.damage -= this.attackPower;  
    this.isStillAlive();  
  }
  damage (n) {
    console.log(`hero of ${this.owner.name} takes ${n} damage!`);
    this.health -= n;
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