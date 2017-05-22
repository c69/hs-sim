"use strict";
// @ts-check

const Game = require('./classes/game2.js');
const Deck = require('./classes/deck.js');
const Player = require('./classes/player.js');

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
let card_defs = CardDefinitions.filter(v => v.collectible === true)
    .filter(v => [TYPES.minion, TYPES.spell].includes(v.type))
    .filter(v => [
      //'Chillwind Yeti',
      //'River Crocolisk',
      //'Bloodfen Raptor',
      'Fireball',
      'Arcane Explosion',
      //'Hellfire',
      //'Flame Imp',
      //'Ironfur Grizzly',
      'Leper Gnome',
      'Abomination',
      'Elven Archer'
    ].includes(v.name))
    ;
    

console.log('initializing players');

//facepalm - quantum entanglement =_=    
// - atm - player depends on deck depends on list of cards depends on owner = player (!) cirular
//todo: split
let deck1 = [];
let deck2 = [];
let dude1 = new Player('Alice');
let dude2 = new Player('Bob');
dude1.deck = new Deck(deck1);
dude2.deck = new Deck(deck2);

[[deck1, dude1, 'HERO_08'], [deck2, dude2, 'HERO_01']].forEach(([deck, player, hero_id]) => {
    //console.log(deck, player);
    try {
      deck.push(new Card.Hero(CardDefinitionsIndex[hero_id], player));
      deck[0].zone = 'PLAY';
      for (let i = 0; i < 30; i++) {
          let dice = Math.floor(Math.random()*(card_defs.length));
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
console.log('bootstrap finished');

//e2e test for Fatigue
let lazy1 = new Player('Lazy1');
let lazy2 = new Player('Lazy2');
lazy1.deck = new Deck([
  new Card.Hero(CardDefinitionsIndex['HERO_08'], lazy1)
]);
lazy2.deck = new Deck([
  new Card.Hero(CardDefinitionsIndex['HERO_08'], lazy2)  
]);
lazy1.deck._arr[0].zone = 'PLAY';
lazy2.deck._arr[0].zone = 'PLAY';

var g_fatigue = new Game([
  lazy1,
  lazy2  
]);
g_fatigue.start();
try {

for(let i = 0; i < 66 && !g_fatigue.isOver; i++) {
  g_fatigue.endTurn();
}
g_fatigue.view();

} catch(err) {console.log(err)}
console.log('==================');

// bootstrap / init
try {

// actual play
let g2 = new Game([dude1, dude2]);
g2.start();

    //console.log('starting the game...333');
//AI - Artificial stupIdity
for(let i = 0; i < 13 && !g2.isOver; i++) {
  g2.view();

  //g.usePower(0); // hero power first suggested target
  //g.playCard(0,0); // play first possible card at first target
  //g.attack(0,0); // attack with first suggested character first suggested target
  //g.viewState();
  //g.viewAvailableOptions();

  let max_actions_per_turn = 10;
  for (let i = 0; i < max_actions_per_turn; i++) {
    let opts = g2.viewAvailableOptions();
    //console.log(`${g2.activePlayer.name}'s options:`, opts);
    if (!opts.actions.length) break;
    g2.chooseOption(); // just greedy do whatever you can (Hero is always first target, and attacks are free)
  }
  
  console.log('___________________');
  g2.endTurn();
}
} catch (err) {console.warn(err)}