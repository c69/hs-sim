"use strict";

class Game {
  constructor (players) {
    this.players = players;
    this.turn = 0;
  }
  start () {
    this.isOver = false;
    this.players.forEach(player => {
      player._onLoose = function () {
        this.finish(player);
      }.bind(this);
      player.draw(5);
      player.manaCrystals = 1;
      player.mana = player.manaCrystals;
    });

    return this;  
  }
  nextTurn () {
    if (this.isOver) return this;

    this.turn += 1;
    let player = this.players[this.turn % 2];
    if (player.manaCrystals < 10) {
      player.manaCrystals += 1;
    }
    player.mana = player.manaCrystals;
    player.draw(1);
  
    return this;
  }
  view () {
    console.log(`turn # ${this.turn}`);
    //console.log(`${this.players.forEach(({mana, hp, deck, hand})=>[mana, hp, deck.length, hand.length])}`);
    console.log(`hand: ${this.players[0].hand.size}`);
    console.log(`mana: ${this.players[0].mana} / ${this.players[0].manaCrystals}`);
    console.log(`hp: ${this.players[0].hero.hp}`);

    return this;
  }
  finish () {
    this.isOver = true;
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
        // cannot deduct .isPlayable !!! - no mana info, no global state
      }
    });
  }
  play (card_idx) {
    // add sanity check for if mana/cost changed but ID remains the same, etc
    var card = this._hand.splice(card_idx, 1)[0];
    this.owner.mana -= card.price;
    console.log(card);
    return card.action;
    /*
    if (card_id in hand) // lol yes, pseudo code
     and isPlayable
     and enoughMana // do we need 2 ? 

     then play
      hand[id].play();
      // what about targeting ?!
      // if card.isNeedTarget ? isNeedOptionalTarget ? isNeedTargetIfConditionMet ??? (-__-)
    */  
  } // ?
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
  let dice = (Math.floor(1 + Math.random()*5));
  fireballs.push(
    //new Card('Fireball')
    dice === 4 ? new FireballCard() :
      new JunkCard('x'.repeat(dice), dice)
  );
}
var deck_prime = new Deck(fireballs);
var deck_prime2 = new Deck(fireballs);

var p1 = new Player(deck_prime, 'Alice');
var p2 = new Player(deck_prime2, 'Bob');

var g = new Game([p1, p2]);
g.start();
g.view();

for(let i = 0; i < 10; i++) {
  g.nextTurn().view();
}

for(let i = 0; i < 42 && !g.isOver; i++) {
  p1.hand.view();
  let fireball = p1.hand.list().find(({name}) => name === 'Fireball');
  if (fireball) {
    console.log(fireball, p1.hand.play);
    p1.hand.play(fireball.id)(p2.hero);
  } else {
    let whatever = p1.hand.listPlayable()[0];
    whatever && p1.hand.play(whatever.id)(p2.hero);
  }
  g.nextTurn().view();
}