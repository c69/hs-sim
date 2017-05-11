"use strict";
// @ts-check

const Game = require('./classes/game.js');
const Deck = require('./classes/deck.js');
const Player = require('./classes/player.js');

const Minion = require('./classes/minion.js');
const MinionCard = require('./classes/cards.js').MinionCard;
const FireballCard = require('./classes/cards.js').FireballCard;
const JunkCard = require('./classes/cards.js').JunkCard;

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

//e2e test for Fatigue
var g_fatigue = new Game([
  new Player(new Deck(zombies), 'Lazy1'), 
  new Player(new Deck(zombies), 'Lazy2')
]);
g_fatigue.start();

for(let i = 0; i < 42 && !g_fatigue.isOver; i++) {
  g_fatigue.nextTurn();
}
g_fatigue.view();

console.log('==================');

// bootstrap / init
var deck_prime = new Deck(fireballs);
var deck_prime2 = new Deck(zombies);

var p1 = new Player(deck_prime, 'Alice');
var p2 = new Player(deck_prime2, 'Bob');

// actual play
var g = new Game([p1, p2]);
g.start();

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
