"use strict";
// @ts-check

const Game = require('./classes/game.js');
const Deck = require('./classes/deck.js');
const Player = require('./classes/player.js');

/**
 * intentionally non-generic card class / API sketch
 */
class FireballCard {
  constructor () {
    // cannot pick a good name :(
    this.price = 4;
    this.name = 'Fireball';
  }
  action (fireballTarget) {
    fireballTarget.damage(6);
    //return chooseTarget(['minion', 'hero']).damage(6);
    //return chooseTarget(['minion', 'hero'], spell.dealDamage(6));
    //return dealDamageToSingleTarget(6, ['minion', 'hero']);
  }
}

class JunkCard {
  constructor (name, price) {
    this.price = price;
    this.name = name;
  }
  action () {
    //console.log(`nothing happens [${this.price} mana wasted..]`)
    console.log(`nothing happens, -some- mana wasted..]`)
  }//o_O you cannot bind(this) es6 methods ??? // .bind(this);// becoz we return action fn from hand.play()
}

class MinionCard {
  constructor (minion, price) {
    // cannot pick a good name :(
    this.price = price;
    this.name = minion.name;
    this.health = minion.health;
    this.attackPower = minion.attackPower;
    this.summons = this.minion = minion; // ???

    this.action = this.action.bind(this); // ES6 caveman bind
  }
  action (player) {
    //player.board.choosePosition(); ??
    player.board.addOwn(player, this.minion); //bug !!!
    //player.summonMinion(this.minion);
  }
}

class Minion {
  constructor ({name, attackPower, health, price}) {
    this.name = name;
    this.health = health;
    this.attackPower = attackPower;
    this.isWaiting = true; // initial ZZZ / sleep
    this.attackedThisTurn = 0; // this is getting convoluted =/
  } 
  play () {}
  attack (target) {
    target.damage(this.attackPower);
    //target.defend(this.attackPower);
    //target.defend(this);
  }
  defend () {}
  damage () {}
  die () {}
  toString () {
    return `[Object Minion: ${this.name}]`;
  }
}

var fireballs = [];
for (let i = 0; i < 30; i++) {
  let dice = (Math.floor(1 + Math.random()*5));
  fireballs.push(
    //new Card('Fireball')
    dice === 4 ? new FireballCard() :
      //new JunkCard('x'.repeat(dice), dice)
      new MinionCard(new Minion({
        name: 'Elemental ' + '*'.repeat(dice),
        attackPower: dice + 1,
        health: dice,
        price: dice
      }), dice)
  );
}

// bootstrap / init
var deck_prime = new Deck(fireballs);
var deck_prime2 = new Deck(fireballs);

var p1 = new Player(deck_prime, 'Alice');
var p2 = new Player(deck_prime2, 'Bob');

// actual play
var g = new Game([p1, p2]);
g.start();
g.view();

for(let i = 0; i < 10; i++) {
  g.nextTurn().view();
}

//AI - Artificial stupIdity
for(let i = 0; i < 42 && !g.isOver; i++) {
  
  // attack face with all you have !
  let minions = p1.board.listOwn(p1).minions;
  let enemy = p1.board.listOwn(p2).hero;
  minions.forEach(minion => minion.attack(enemy));

  p1.hand.view();
  let fireball = p1.hand.list().find(({name}) => name === 'Fireball');
  if (fireball) {
    console.log(fireball, p1.hand.play);
    p1.hand.play(fireball.id)(p2.hero);
  } else {
    let whatever = p1.hand.listPlayable()[0];
    //whatever && p1.hand.play(whatever.id)(p2.hero); // spell - target is enemy hero: Bob
    whatever && p1.hand.play(whatever.id)(p1); // minion - owner is player: Alice  
  }
  g.nextTurn().view();
}
