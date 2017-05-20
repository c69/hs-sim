const Player = require('./player.js');
const CardJSON = require('../data/cards.generated.json');


const ZONES = {
  deck: 'DECK',
  hand: 'HAND',
  play: 'PLAY',
  grave: 'GRAVE',
  aside: 'ASIDE',
  secret: 'SECRET'
};

const TYPES = {
  minion: 'MINION',
  spell: 'SPELL',
  weapon: 'WEAPON',
  hero: 'HERO',
  power: 'HERO_POWER',
  enchantment: 'ENCHANTMENT'
};


const PLAYERCLASS = {
  mage: 'MAGE',
  priest: 'PRIEST',
  warlock: 'WARLOCK',
  paladin: 'PALADIN',
  warrior: 'WARRIOR',
  rogue: 'ROGUE',
  hunter: 'HUNTER',
  druid: 'DRUID',
  shaman: 'SHAMAN',
  //
  neutral: 'NEUTRAL',
  //
  dream: 'DREAM'
};


let deck_id = 1;

class Card {
    constructor (cardDef, owner) {
      if (!cardDef || typeof cardDef !== 'object') throw new TypeError('Object expected');
      if (!owner) throw new RangeError('Owner player required');

      this.id = cardDef.id;
      //this.dbfId = cardDef.dbfId;
      this.type = cardDef.type;
      this.name = cardDef.name;
      this.text = cardDef.text;
      //this.targetingArrowText = cardDef.targetingArrowText;

      this.playerClass = cardDef.playerClass; // .cardClass seems to be missing on some cards
      //.multiclass
      this.rarity = cardDef.rarity;

      this.cost = cardDef.cost;

      this.zone = ZONES.deck;
      this.owner = owner;

      this.deck_id = deck_id++;  
    }
    _draw () {
        this.zone = ZONES.hand
    }
    _play () {
        if (this.zone !== ZONES.hand) throw 'Attempt to play card NOT from hand';

        this.zone = ZONES.aside;
        this.play();
        if (this.type === TYPES.minion || this.type === TYPES.weapon) {
            this.zone = ZONES.play
        } else if (this.type === TYPES.spell) {
            this.zone = this.isSecret ? ZONES.secret : ZONES.grave;
        } else {
            throw `Played card of unplayable type:${this.type}`;
        }
    }
    _mill () {
        this.zone = ZONES.grave
    }
    _die () {
        this.zone = ZONES.grave
    }
}

class Minion extends Card {
    constructor (cardDef, ...args) {
      super(cardDef, ...args);
      if (this.type !== TYPES.minion) throw new RangeError(
          `Card definition has type: ${this.type}, expected: ${TYPES.minion}`);
      
      this.attack = cardDef.attack || 0;
      this.health = cardDef.health || 0;
      this.race = cardDef.race; // or undefined   
    }
}
class Spell extends Card {
    constructor (cardDef, ...args) {
      super(cardDef, ...args);
      if (this.type !== TYPES.spell) throw new RangeError(
          `Card definition has type: ${this.type}, expected: ${TYPES.spell}`);
      
      //this.isSecret = false; // impement
      //this.isQuest = false; // implement   
    }
}
class Weapon extends Card {
    constructor (cardDef, ...args) {
      super(cardDef, ...args);
      if (this.type !== TYPES.weapon) throw new RangeError(
          `Card definition has type: ${this.type}, expected: ${TYPES.weapon}`);
      
      this.attack = cardDef.attack || 0;
      this.health = cardDef.durability || 0;   
    }
}
class Hero extends Card {
    constructor (cardDef, ...args) {
      super(cardDef, ...args);
      if (this.type !== TYPES.hero) throw new RangeError(
          `Card definition has type: ${this.type}, expected: ${TYPES.hero}`);
      
      this.attack = cardDef.attack || 0;
      this.health = cardDef.health || 0;
      this.armor = cardDef.armor || 0;
      //this.power = card_id ? or this.tags[battlecry () {change_power(card_id)}]   
    }
}
class Power extends Card {
    constructor (cardDef, ...args) {
      super(cardDef, ...args);
      if (this.type !== TYPES.power) throw new RangeError(
          `Card definition has type: ${this.type}, expected: ${TYPES.power}`);
      
      this.attack = cardDef.attack || 0;
      this.health = cardDef.durability || 0;   
    }
}
class Enchantment extends Card {
    constructor (cardDef, ...args) {
      super(cardDef, ...args);
      if (this.type !== TYPES.enchantment) throw new RangeError(
          `Card definition has type: ${this.type}, expected: ${TYPES.enchantment}`);
      
      this.attack = cardDef.attack || 0;
      this.health = cardDef.durability || 0;   
    }
}

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

let card_defs = CardJSON.filter(v => v.collectible === true);
[[arr1, p1], [arr2, p2]].forEach(([deck, player]) => {
    for (let i = 0; i < 30; i++) {
        let dice = Math.floor(Math.random()*(card_defs.length - 1));
        let card = card_defs[dice];
        let structor = {
            [TYPES.minion]: Minion,
            [TYPES.hero]: Hero,
            [TYPES.weapon]: Weapon,
            [TYPES.spell]: Spell,
            [TYPES.power]: Power,
            [TYPES.enchantment]: Enchantment,
        }[card.type];
        deck.push(new structor(card, player));    
    }
});

class GameBoardWithZonesAndCardSelector {
  constructor (deck1, deck2, player1, player2) {
    this.deck1 = deck1;
    this.deck2 = deck2;
    this.player1 = player1;
    this.player2 = player2;
  }
  $ (selector_string, player) {
    let [ownPlayer, enemyPlayer] = this.player1 === player ? [this.player1, this.player2] : [this.player2, this.player1];

    let tokens = selector_string.split(/\s+/);
    let filters = [];

    //card owner: XOR 
    if (!tokens.includes('any')) {
      if (tokens.includes('enemy')) {
        filters.push(v = v.owner !== own);  
      } else if (tokens.includes('own')) {
        filters.push(v = v.owner === own);
      }
    }

    //card type: AND
    if (!tokens.includes('card')) {
      let allowed_types = [];  
      if (tokens.includes('minion')) {
        allowed_types.push('minion');  
      }
      if (tokens.includes('hero')) {
        allowed_types.push('hero');  
      } 
      if (tokens.includes('character')) {
        allowed_types.push('hero', 'minion');  
      } 
      if (tokens.includes('weapon')) {
        allowed_types.push('weapon');  
      }
      if (tokens.includes('spell')) {
        allowed_types.push('spell');  
      }
      console.log(allowed_types);
      filters.push(v => allowed_types.includes(v.type));
    }


    var tagSelectors = tokens.filter(v => /^#[a-z]+/i.test(v));
    console.log('tagSelectors', tagSelectors);

    var zoneSelectors = tokens.filter(v => /^@[a-z]+/i.test(v));
    console.log('zoneSelectors', zoneSelectors);

    let propRegexp = /^\.[0-9a-z]+((=|!=|<|>|<=|>=)[0-9a-z]+){0,1}$/i;
    //.test('.prop<42')
    var propSelectors = tokens.filter(v => propRegexp.test(v));
    console.log('propSelectors', propSelectors);
    //return tokens;  
    
    let all_cards = [...this.deck1, ...this.deck2];
    //console.log(filters[0].toString());
    return filters.reduce((a,v) => a.filter(v), all_cards);
    //return all_cards.map(v=>v.type);
    //return [...this.deck1, ...this.deck2].filter(v => v.zone === ZONES.play);
  }
}

let s = new GameBoardWithZonesAndCardSelector(arr1, arr2, p1, p2);

//console.log(s.$('any card @deck .cost #taunt #divineShield', p2).map(v=>v.name));
console.log(s.$('any card @deck', p2).map(v=>v.name));
