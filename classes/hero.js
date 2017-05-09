'use strict';
// @ts-check

class Hero {
  constructor (player) {
    this.name = player.name; // yes, technically - "Guldan" != "CutePumkin312"
    this.health = 30;
    //this.attackPower = 0;
    this.owner = player;
  }
  get hp () {
    return this.health;
  }
  damage (n) {
    this.health -= n;
    console.log(`hero of ${this.owner.name} takes ${n} damage!`);
    if (this.health < 0) {
      this.die();
    }
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