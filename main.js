"use strict";
// @ts-check

const Game = require('./classes/game.js');
const Board = require('./classes/board.js');

class Deck {
  constructor (arr) {
    this._deck = arr;
  }
  draw (n = 1) {
    var result = [];
    while (n > 0) {
      var card = this._deck.shift();
      if (card) {
       result.push(card);
      }
      n--;
    }
    return result;
  }
  get size () {
    return this._deck.length;
  }
}

class Hand {
  constructor (player) {
    this._hand = [];
    this.owner = player;
  }
  view () {
    console.log(this._hand.map(({price, name}) => `(${price}) ${name}`).join(', '))
  }
  listPlayable () {
    return this.list().filter(({price}) => price <= this.owner.mana);
  }
  list () {
    return this._hand.map((v,i) => {
      return {
        id: i, // consider a harder proof, like autoincrement
        name: v.name,
        price: v.price
      }
    });
  }
  play (card_idx) {
    // add sanity check for if mana/cost changed but ID remains the same, etc
    var card = this._hand.splice(card_idx, 1)[0];
    this.owner.mana -= card.price;
    console.log(card);
    return card.action;

    // what about targeting ?!
    // if card.isNeedTarget ? isNeedOptionalTarget ? isNeedTargetIfConditionMet ??? (-__-)
  }
  add (card) {
    if (this._hand.length > 9) {
      return;
    } 
    this._hand.push(card);
  }
  get size () {
    return this._hand.length;
  }
}

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

class Player {
  constructor (deck, name) {
    this.deck = deck;
    this.hand = new Hand(this);
    this.name = name;
    this.hero = new Hero(this);
    this.fatigue = 1;
  }
  draw (n) {
    var newCards = this.deck.draw(n);
    if (!newCards.length) this.hero.damage(this.fatigue++);
    newCards.forEach(card => (
      this.hand.add(card)
    ), this);
  }
  loose () {
    console.warn(`player ${this.name} LOST the game`);
    this._onLoose(); // looks convoluted..
  }
  _onLoose () {}
}


class Hero {
  constructor (player) {
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
