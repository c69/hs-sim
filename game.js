"use strict";

class Game {
  constructor (players) {
    this.players = players;
    this.turn = 0;
  }
  start () {
    this.players.forEach(player => {
      player.deck.draw(5);
      player.mana = 1;
    });

    return this;  
  }
  nextTurn () {
    this.turn += 1;
    let player = this.players[this.turn % 2];
    if (player.mana < 10) {
      player.mana += 1;
    }
    player.draw(1);
  
    return this;
  }
  view () {
    console.log(`turn # ${this.turn}`);
    //console.log(`${this.players.forEach(({mana, hp, deck, hand})=>[mana, hp, deck.length, hand.length])}`);
    console.log(`hand: ${this.players[0].hand.size}`);
    console.log(`mana: ${this.players[0].mana}`);
    console.log(`hp: ${this.players[0].hero.hp}`);

    return this;
  }
  finish () {
    //return this;
  }
}

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
  constructor () {
    this._hand = [];
  }
  play (card_id) {} // ?
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

class Card {
  constructor ({
    type,
    id,
    name,
    price,
    text
  }) {
    Object.assign(this, {
      type,
      id,
      name,
      price,
      text //?
    });
  }
  play () {
    this.action(); //o, yeah.. no action in API :( 
  }
}

function dealDamage (target, amount) {
  target.damage(amount); //...
}

class Mana {
  constructor (player) {

  }
  increment (n) {}
  get amount () {}
}

class Player {
  constructor (deck, name) {
    this.deck = deck;
    this.hand = new Hand();
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
    console.warn(`player LOST the game`);
  }
}

class Board {
  constructor (player1, player2) {
    this.hero1 = player1.hero;
    this.hero2 = player2.hero;
  }
} 

class Hero {
  constructor (player) {
    this.health = 30;
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
  fireballs.push(
    new Card('Fireball')
  );
}
var deck_prime = new Deck(fireballs);
var deck_prime2 = new Deck(fireballs);

var p1 = new Player(deck_prime, 'Alice');
var p2 = new Player(deck_prime2, 'Bob');

var g = new Game([p1, p2]);
g.start();
g.view();

for(let i = 0; i < 42; i++) {
  g.nextTurn().view();
}