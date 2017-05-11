"use strict";
// @ts-check

const Game = require('./classes/game.js');
const Deck = require('./classes/deck.js');
const Player = require('./classes/player.js');

const Minion = require('./classes/minion.js');

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

var fireballs = [];
for (let i = 0; i < 30; i++) {
  let dice = (Math.floor(1 + Math.random()*5));
  fireballs.push(
    //new Card('Fireball')
    dice === 4 ? new FireballCard() :
      //new JunkCard('x' + dice, dice)
      new MinionCard(new Minion({
        name: 'Elf' + dice,
        attackPower: dice,
        health: dice,
        price: dice
      }), dice)
  );
}


var zombies = [];
for (let i = 0; i < 30; i++) {
  let dice = (Math.floor(1 + Math.random()*5));
  zombies.push(
    new MinionCard(new Minion({
        name: 'Zomb' + dice,
        attackPower: dice + 0,
        health: dice,
        price: dice
      }), dice)
  );
}

// bootstrap / init
var deck_prime = new Deck(fireballs);
var deck_prime2 = new Deck(zombies);

var p1 = new Player(deck_prime, 'Alice');
var p2 = new Player(deck_prime2, 'Bob');

// actual play
var g = new Game([p1, p2]);
g.start();

// for(let i = 0; i < 1; i++) {
//   g.nextTurn().view();
// }

//AI - Artificial stupIdity
for(let i = 0; i < 42 && !g.isOver; i++) {
  g.view();

  let pActive = g.activePlayer;

  let minions = g.board.listOwn(pActive).minions;
  //let enemy = g.board.listEnemy(pActive).hero;
  let enemy;
  if (Math.random()*4 > 3) {
    enemy = g.board.listOwn(pActive === p1 ? p2 : p1).hero; // hack until listEnemy is implemented
  } else {
    enemy = g.board.listOwn(pActive === p1 ? p2 : p1).minions[0];
  }
  if (!enemy) { // just attack face, if no enemey minions
    enemy = g.board.listOwn(pActive === p1 ? p2 : p1).hero; // hack until listEnemy is implemented
  }

  console.log(`${pActive.name} wants to attack ${enemy && enemy.name} with ${minions}`);
  minions.length && minions.forEach(minion => minion.attack(enemy));
 
  if (pActive === p1) {
    pActive.hand.view();
    let fireball = pActive.hand.listPlayable().find(({name}) => name === 'Fireball');
    if (fireball) {
      p1.hand.play(fireball.id)(p2.hero); // hardcode :(
    } else {
      let whatever = pActive.hand.listPlayable()[0];
      console.log(`x Alice has no fireball, so she want to play ${whatever}`);
      //whatever && p1.hand.play(whatever.id)(p2.hero); // spell - target is enemy hero: Bob
      whatever && pActive.hand.play(whatever.id)(pActive); // minion - owner is player: Alice  
    }
  } else {
    pActive.hand.view();
    let aMinion = pActive.hand.listPlayable().filter(({type}) => type === 'minion').sort((a,b)=>b.price-a.price)[0];
    if (aMinion) {
      pActive.hand.play(aMinion.id)(pActive); // minion - owner is player: Bob  
    } else {
      // do we even check whether the turn is active ?
      console.warn('Bob only has fireballs ?');
    }
  }
  
  console.log('___________________');
  g.nextTurn();
}
