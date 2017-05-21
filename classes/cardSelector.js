'use strict';
// @ts-check

//const Player = require('./player.js');
const CardJSON = require('../data/cards.all.generated.json');
const abilitiesMixin = require('../data/actions.collectible.js');
const Card = require('./card.js');
const Board = require('./board2.js');
const TYPES = require('../data/constants.js').CARD_TYPES;
//const SanityCheck = require('../data/constants.js');

console.log(111);

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

console.log(222);

let p1 = {name: 'Alice'};
let p2= {name: 'Bob'};

let arr1 = [
  //new Hero('Jaina'), 
  //new Power('Fireblast')
];
let arr2 = [
  //new Hero('Gul\'Dan'), 
  //new Power('Life Tap')
];

console.log(333);
let card_defs = CardDefinitions.filter(v => v.collectible === true);
[[arr1, p1], [arr2, p2]].forEach(([deck, player]) => {
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
          deck.push(new structor(card, player));    
      }
    } catch (err) {
      console.warn(err);
    }
});


let s = new Board(arr1, arr2, p1, p2);

//console.log(s.$('any card @deck .cost #taunt #divineShield', p2).map(v=>v.name));
console.log(777);
try {
  console.log(s.$(p2, 'any @deck minion').map(v=>v.cost + ' ' + v.name));
} catch (err) {
 console.warn(err);
}