'use strict';
// @ts-check

const Minion = require('./minion.js');

/**
 * intentionally non-generic card class / API sketch
 */
class FireballCard {
  constructor () {
    this.type = "spell";
    this.price = 4;
    this.name = 'Fireball';
  }
  action (fireballTarget) {
    fireballTarget.damage(3);
    //return chooseTarget(['minion', 'hero']).damage(6);
    //return chooseTarget(['minion', 'hero'], spell.dealDamage(6));
    //return dealDamageToSingleTarget(6, ['minion', 'hero']);
  }
}

class JunkCard {
  constructor (name, price) {
    this.type = "spell";
    this.price = price;
    this.name = name;

    this.action = this.action.bind(this); // ES6 caveman bind
  }
  action () {
    console.log(`nothing happens [${this.price} mana wasted..]`)
  }
}

class MinionCard {
  constructor (minion, price) {
    this.type = "minion";
    this.price = price;
    this.name = minion.name;
    this.health = minion.health;
    this.attackPower = minion.attackPower;
    this.minion = minion;
    this.owner = null; // is it ??? should the owner of card be the owner of hand ?!

    this.action = this.action.bind(this); // ES6 caveman bind
  }
  action (player) {
    //player.board.choosePosition(); ??
    this.minion.owner = player;
    player.board.addOwn(player, this.minion);
    //player.summonMinion(this.minion);
  }
  isPlayable (player) { // this could become a _God_ function :/, consider using target: []
    if (player.board.listOwn(p1).minions.length > 6) return false;
    if (player.mana < this.price) return false;
    return true;
  }
  toString () {
    return [`Object Card: ${this.name}`];
  }
}

module.exports = {
  MinionCard,
  FireballCard,
  JunkCard
};