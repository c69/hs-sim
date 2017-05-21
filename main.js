"use strict";
// @ts-check

const Game = require('./classes/game2.js');
const Deck = require('./classes/deck.js');
const Player = require('./classes/player.js');

const Minion = require('./classes/minion.js');
const MinionCard = require('./classes/cards.js').MinionCard;
const FireballCard = require('./classes/cards.js').FireballCard;
const JunkCard = require('./classes/cards.js').JunkCard;

// from CardSelector
const CardJSON = require('./data/cards.all.generated.json');
const abilitiesMixin = require('./data/actions.collectible.js');
const Card = require('./classes/card.js');
//const Board2 = require('./classes/board2.js');
const TYPES = require('./data/constants.js').CARD_TYPES;

let CardDefinitions = JSON.parse(JSON.stringify(CardJSON));
//console.log(1999);
const CardDefinitionsIndex = CardDefinitions.reduce((a,v) => {
  a[v.id] = v;
  return a;
}, {});
//console.log(2001);
abilitiesMixin.forEach(({id, tags, target, play, death}) => {
  //console.log(id);
  try {
    if (play) CardDefinitionsIndex[id].play = play;
    if (target) CardDefinitionsIndex[id].target = target;
    if (death) CardDefinitionsIndex[id].death = death;
    if (tags) CardDefinitionsIndex[id].tags = tags; 
  } catch (err) {
    console.warn(err, CardDefinitionsIndex[id]);
  }
});

//---Deck2.js sketch------------------
let card_defs = CardDefinitions.filter(v => v.collectible === true);
let deck1 = [], deck2 = [];
let dude1 = new Player(new Deck(deck1), 'Alicia');
let dude2 = new Player(new Deck(deck2), 'Bobulion');
[[deck1, dude1], [deck2, dude2]].forEach(([deck, player]) => {
    try {
      for (let i = 0; i < 30; i++) {
          let dice = Math.floor(Math.random()*(card_defs.length - 1));
          let card = card_defs[dice];
          
          let structor = {
              [TYPES.minion]: Card.Minion,
              [TYPES.hero]: Card.Hero,
              [TYPES.weapon]: Card.Weapon,
              [TYPES.spell]: Card.Spell,
              [TYPES.power]: Card.Power,
              [TYPES.enchantment]: Card.Enchantment,
          }[card.type];
          deck.push(new structor(card, player)); // do we really need to couple deck & player ?
      }
    } catch (err) {
      console.warn(err);
    }
});

var fireballs = [];
for (let i = 0; i < 30; i++) {
  let dice = (Math.floor(1 + Math.random()*5));
  fireballs.push(
    //new Card('Fireball')
    dice === 4 ? new FireballCard() :
      //new JunkCard('x' + dice, dice)
      new MinionCard(new Minion({
        name: 'Bear' + dice,
        attackPower: dice,
        health: dice,
        price: dice,
        buffs: [
          'TAUNT',
          {
            //also consider binding "this" to minion for deathrattle and similar functions
            deathrattle: function (self, board, game) { // giving game to ability is KINDA dangerous, as it can .concede(), for example or modify game state =) 
              console.log(`deathrattle: ${self.name} gives last hug to his hero! +2hp`);
              self.owner.hero.dealDamage(-2)// heeeeal :P
            }
          },
          {
            //also consider binding "this" to minion for deathrattle and similar functions
            deathrattle: function (self, board, game) { // giving game to ability is KINDA dangerous, as it can .concede(), for example or modify game state =) 
              console.log(`deathrattle: ${self.name} splashes acid blood around him!`);
              var a = board.listOwn(self.owner);
              var b = board.listEnemy(self.owner);
              [b.hero, ...b.minions, ...a.minions].forEach(v => v.dealDamage(1)); //everyone but own hero
            }
          }
        ]
      }), dice)
  );
}


var zombies = [];
for (let i = 0; i < 30; i++) {
  let dice = (Math.floor(1 + Math.random()*5));
  zombies.push(
    new MinionCard(new Minion({
        name: 'Elf' + dice,
        attackPower: dice + 0,
        health: dice,
        price: dice,
        battleCry: function (t) {
          console.log(`battlecry: ${this.name} shoots his arrow!`);
          t && t.dealDamage(1);
        },
        targetSelector: 'enemy'
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

//----------
try {


// actual play
var g = new Game([dude1, dude2]);
g.start();

//AI - Artificial stupIdity
for(let i = 0; i < 42 && !g.isOver; i++) {
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
} catch (err) {console.warn(err)}