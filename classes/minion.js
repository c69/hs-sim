'use strict';
// @ts-check

class Minion { //will extend Character
  constructor ({name, attackPower, health, price}) {
    this.name = name;
    this.health = health;
    this.attackPower = attackPower;
    this.isWaiting = true; // initial ZZZ / sleep
    this.attackedThisTurn = 0; // this is getting convoluted =/
    this.owner = null; // maybe init Minion with owner upon creation ?

    // this.tribe = "";
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
    //? this.isEnraged = false;
    //? this.canAttackHeroesWithCharge = false;
    // this.divineShield = false;
    // this.windFury = false;
    // this.megaWindFury = false;
    
    // this.isSilenced = false;
  } 
  attack (target) {
    if (!target) return;
    if (target.health < 1) return;
    if (this.health < 1) return;
    if (target.owner === this.owner) return;
    console.log(`A ${this.name}(${this.attackPower}/${this.health}) attacks ${target.name}`);

    target.defend(this);
  }
  defend (attacker) {
    console.log(`D ${attacker.name} attacks ${this.name}(${this.attackPower}/${this.health})`);
    //ignore shields, etc for now
    this.health -= attacker.attackPower;
    attacker.damage -= this.attackPower;  
    this.isStillAlive();  
  }
  damage (n) {
    this.health -= n;
    this.isStillAlive();
  }
  isStillAlive() {
    if (this.health < 1) this.die();
  }
  die () {
    //TODO: add minion removal on death asap ! 
    console.log(`minion died: ${this.owner.name}'s ${this.name}`)
    //this.owner.board.remove ????
    //maybe move him to invisible graveyard (owner) ?
  }
  toString () {
    return `[Object Minion: ${this.name}]`;
  }
}

module.exports = Minion;