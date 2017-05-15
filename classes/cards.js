'use strict';
// @ts-check

const Minion = require('./minion.js');

/**
 * intentionally non-generic card class / API sketch
 */
class FireballCard {
  constructor () {
    this.type = 'spell';
    this.price = 4;
    this.name = 'Fireball';
  
    this.play = this.play.bind(this); // ES6 caveman bind
  }
  play (fireballTarget) {
    fireballTarget.dealDamage(3);
    //return chooseTarget(['minion', 'hero']).damage(6);
    //return chooseTarget(['minion', 'hero'], spell.dealDamage(6));
    //return dealDamageToSingleTarget(6, ['minion', 'hero']);
  }
}

class JunkCard {
  constructor (name, price) {
    this.type = 'spell';
    this.price = price;
    this.name = name;

    this.play = this.play.bind(this); // ES6 caveman bind
  }
  play () {
    console.log(`nothing happens [${this.price} mana wasted..]`)
  }
}

class HellFireCard {
  constructor () {}
  _hasValidTargets_arePreconditionsMet () {
    
  }
  play (self, board) { //arcane blast
    board.listEnemy(self.owner).minions.forEach(v=>v.dealDamage(1));
  }
  play2 (self, board) { //hellfire
    //lol.
    board.listAll_TargetableBySpells_AsArray(self.owner).forEach(v=>v.dealDamage(1));
  }
}

class MinionCard {
  constructor (minion, price) {
    this.type = 'minion';
    this.price = price;
    this.name = minion.name;
    this.health = minion.health;
    this.attackPower = minion.attackPower;
    this.minion = minion;
    this.owner = null; // is it ??? should the owner of card be the owner of hand ?!
    this.buffs = [];
    this.battleCry = minion.battleCry || null; // lets start with API slowly ..

    this.play = this.play.bind(this); // ES6 caveman bind
  }
  play (player, board, positionForSummoning = 0, targetForBattleCry) {
    //game.summon(minion, player);
    
    //player.board.choosePosition(); ??
    this.minion.owner = player;
    board.addOwn(player, this.minion);
    //player.summonMinion(this.minion);

    if (this.battleCry) {
      this.battleCry(targetForBattleCry);
    };
  }
  /** @deprecated */
  x_isPlayable (player) { // this could become a _God_ function :/, consider using target: []
    // cards should encapsulate THEIR RULES for valid targets, not the world rules
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