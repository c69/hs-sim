"use strict";

class Game {
  constructor (player1, player2, deck1, deck2) {
    this.player1 = player1;
    this.player2 = player2;
    this.deck1 = deck1;
    this.deck2 = deck2;
    this.turn = 0;
  }
  start () {
    // = each ?
    player1.hand += deck1.draw(5);
    player2.hand += deck2.draw(5);
    player1.mana = 1;
    player2.mana = 1;
  }
  nextTurn () {
    turn += 1;
    if (player1.mana < 10) {
      player1.mana += 1;
    }
    if (player1.mana < 10) {
      player1.mana += 1;
    }
    player1.hand += deck1.draw(1);
    player2.hand += deck2.draw(1);
    
  }
  finish () {}
}

class Deck {
  draw (n = 1) {}
}

class Hand {
  play (card_id) {} // ?
  add (card)
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
  constructor () {}
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

var g = new Game(p1, p2, deck_prime, deck_prime2);
g.start();