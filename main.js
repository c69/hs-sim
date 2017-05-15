"use strict";
// @ts-check

const Game = require('./classes/game2.js');
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
    dice !== 4 ? new FireballCard() :
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

for(let i = 0; i < 66 && !g_fatigue.isOver; i++) {
  g_fatigue.endTurn();
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
for(let i = 0; i < 17 && !g.isOver; i++) {
  g.view();

  //g.usePower(0); // hero power first suggested target
  //g.playCard(0,0); // play first possible card at first target
  //g.attack(0,0); // attack with first suggested character first suggested target
  //g.viewState();
  //g.viewAvailableOptions();

  for (let i = 0; i < 10; i++) {
    let opts = g.viewAvailableOptions();
    //console.log(`${g.activePlayer.name}'s options:`, opts);
    if (!opts.actions.length) break;
    g.chooseOption(); // just greedy do whatever you can (Hero is always first target, and attacks are free)
  }
  
  console.log('___________________');
  g.endTurn();
}
