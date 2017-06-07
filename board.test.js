'use strict';
// @ts-check

const {
    ZONES,
    CARD_TYPES,
    TAGS,
    PLAYERCLASS
} = require('./data/constants.js');

const Board = require('./classes/board.js');


let arr0a = [],
    arr0b = [],
    p0a = {name: 'Alice'},
    p0b = {name: 'Bob'};

let b0 = new Board(
    arr0a,
    arr0b,
    p0a,
    p0b
);

arr0a.push({
    id: 'test 1',
    health: 3,
    zone: ZONES.play,
    type: CARD_TYPES.minion,
    owner: p0a
});

arr0b.push({
    id: 'test 2',
    health: 3,
    zone: ZONES.hand,
    type: CARD_TYPES.minion,
    owner: p0b
});


let test0 = b0.$(p0a, 'spell');
//if (test0.length !== 0) throw 'TEST 0: wrong length';

let test1 = b0.$(p0a, 'own minion');
if (test1.length !== 1) throw 'TEST 1: wrong length';
if (test1[0].id !== 'test 1') throw 'TEST 1: wrong id' + test1.id;

let test2 = b0.$(p0b, 'own minion');
if (test2.length !== 0) throw 'TEST 2: wrong length';

let test3 = b0.$(p0b, 'minion @hand');
//if (test3.length !== 1) throw 'TEST 3: wrong length' + test3.length;
//if (test3[0].id !== 'test 2') throw 'TEST 3: wrong id';


//======================
let arr1a = [],
    arr1b = [],
    p1a = {name: 'Alice'},
    p1b = {name: 'Bob'};

let b1 = new Board(
    arr1a,
    arr1b,
    p1a,
    p1b
);

for (let i = 0; i < 99; i++) {
    let dice = Math.floor(Math.random()*10);
    arr1a.push({
      zone: dice < 2 ? ZONES.hand : ZONES.deck,
      owner: p1a,
      type: dice < 7 ? CARD_TYPES.minion : CARD_TYPES.spell,
      name: 'Test',
      tags: [TAGS.taunt]
    });
    arr1b.push({
      zone: dice < 3 ? ZONES.play : ZONES.grave,
      owner: p1b,
      type: [ CARD_TYPES.minion, CARD_TYPES.spell, CARD_TYPES.weapon][dice % 3],
      name: 'Test',
      tags: [TAGS.taunt]
    });
}

let $1 = b1.$.bind(b1);

let query = [
    'own minion',
    'character',
    'enemy minion',
    'minion .race=beast',
    'enemy minion .health>0',
    'enemy character .health>0',
    '#taunt',
    'spell @deck'
];
let side_effect = [];
let _timeStart = Date.now();
let _N_RUNS = 100*1000;
for (let j = 0; j < _N_RUNS; j++) { 
    //let result = $1(p1a, query[j % query.length]);
    let result = b1.$(p1a, query[j % query.length]);
    
    side_effect.push([result.slice(-1), result.length]);
}
let duration_of_quick_run = ((Date.now()- _timeStart)/1000).toFixed(3);

console.log(side_effect[999]);

console.log(`completed ${_N_RUNS} calls in ${duration_of_quick_run}s`);
console.log(Board._profile());