"use strict";

class Game {
  constructor (players) {
    this.players = players;
    this.turn = 0;
  }
  start () {
    this.players.forEach(player => {
      player.deck.draw(5).forEach(card => (
        player.hand.add(card)
      ));
      player.mana = 1;
    });

    return this;  
  }
  nextTurn () {
    turn += 1;
    this.players.forEach(player => {
      if (player.mana < 10) {
        player.mana += 1;
      }
      player.deck.draw(1).forEach(card => (
        player.hand.add(card)
      ));
    });   

    return this;
  }
  view () {
    console.log(42);
    //console.log(`${this.players.forEach(({mana, hp, deck, hand})=>[mana, hp, deck.length, hand.length])}`);
    console.log(`hand: ${this.players[0].hand.size}`);
    
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
    return [this._deck.unshift()]; // only 1 for now, N is ignored
  }
}

class Hand {
  constructor () {
    this._hand = [];
  }
  play (card_id) {} // ?
  add (card) {
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
  constructor (deck) {
    this.deck = deck;
    this.hand = new Hand();
  }
  get hp () {}

}

var fireballs = [];
for (let i = 0; i < 30; i++) {
  fireballs.push(
    new Card('Fireball')
  );
}
var deck_prime = new Deck(fireballs);
var deck_prime2 = new Deck(fireballs);

var p1 = new Player(deck_prime);
var p2 = new Player(deck_prime2);

var g = new Game([p1, p2]);
g.start();
g.view();