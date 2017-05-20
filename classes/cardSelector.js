const Player = require('./player.js');
const CardJSON = require('../data/cards.all.generated.json');


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
      this.overload = cardDef.overload;

      this.tags = cardDef.tags || [];

      this.play = cardDef.play;
      this.target = cardDef.target;
      //this.chooseOne = ???
      //this.joust = ???
      
      this.death = cardDef.death; 
      // this.tags.push(cardDef.death)
      this.trigger = cardDef.trigger;
      this.aura = cardDef.aura;
      // this.secret = cardDef.secret;
      // this.quest = cardDef.quest;


      this.zone = ZONES.deck;
      this.owner = owner;

      this.deck_id = deck_id++;  
    }
    _draw () {
        if (this.zone !== ZONES.deck) throw 'Attempt to draw NOT from deck';
        this.zone = ZONES.hand;
    }
    _play () {
        if (this.zone !== ZONES.hand) throw 'Attempt to play card NOT from hand';
        this.zone = ZONES.aside;

        // if (this.target) {
        //   asyncChooseTarget, OR expect it to be provided in arguments ?
        //   btw, asynctChoosePosition ? - should work the same way ..
        // };

        // todo: consider splitting this IF so proper event could be emitted
        if (this.type === TYPES.minion || this.type === TYPES.weapon) {
            this.zone = ZONES.play;
        } else if (this.type === TYPES.spell) {
            this.zone = this.isSecret ? ZONES.secret : ZONES.grave;
        } else {
            throw `Played card of unplayable type:${this.type}`;
        }
        
        this.play({self, $, game, target, position}); // battlecry !

    }
    _mill () {
        this.zone = ZONES.grave;
    }
    _die () {
        this.death && this.death({self, $, game}); // deathrattle
        this.zone = ZONES.grave;
    }
    _copy () {
        let copy = new this.prototype.constructor(this, this.owner);
        // copy.tags[] are DIRTY !
        copy.zone = ZONES.aside; 
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

class Board2 {
  constructor (deck1, deck2, player1, player2) {
    this.deck1 = deck1;
    this.deck2 = deck2;
    this.player1 = player1;
    this.player2 = player2;
  }
  /** 
   * Declarative Array.filter on steroids. Uses DSL for queries:
   * - Owner: [any|own|enemy] XOR //TODO: should it be like this ? (default = any)
   * - Type: [card|character|minion|hero|weapon|power|spell] OR (default = card)
   *   where 'card' is any card, 'character' is 'hero OR minon'
   *   (!) enchantments are not searchable, at least for now
   * - Zone: @[deck|hand|play|grave|aside|secret] OR (default = @play)
   * - Tags: #[tagName] check if card has tag currently //TODO: add full list
   *   e.g: 'minion #taunt' or 'minion #battlecry'
   * - Prop: .[propertyName][<|>|=|!=|<=|>=], read any property from card object
   *   and check boolean, string or number value
   *   e.g.: 'minion .attack<3' or 'minion race=murloc' or 'character .isReady'
   * - (NOT IMPLEMENTED) Negation: [!self|!.prop] for the real world cases when you need to exclude something
 
   * @param {Player} player Could (and should) be curried for card helper function (player is self.owner)
   * @param {string} selector Refer to syntax above 
   */
  $ (player, selector_string) {
    let [ownPlayer, enemyPlayer] = this.player1 === player ? [this.player1, this.player2] : [this.player2, this.player1];

    let tokens = selector_string.split(/\s+/);
    let filters = [];

    //card owner: choose one - XOR 
    if (!tokens.includes('any')) {
      if (tokens.includes('enemy')) {
        filters.push(v = v.owner !== ownPlayer);  
      } else if (tokens.includes('own')) {
        filters.push(v = v.owner === ownPlayer);
      }
    }

    //card type: BROADEN the search - OR
    let allowed_types = [];  
    if (!tokens.includes('card')) {

      if (tokens.includes('minion')) {
        allowed_types.push(TYPES.minion);  
      }
      if (tokens.includes('hero')) {
        allowed_types.push(TYPES.hero);  
      } 
      if (tokens.includes('character')) {
        allowed_types.push(TYPES.hero, TYPES.minion);  
      } 
      if (tokens.includes('weapon')) {
        allowed_types.push(TYPES.weapon);  
      }
      if (tokens.includes('spell')) {
        allowed_types.push(TYPES.spell);  
      }
      console.log('types', allowed_types);
      filters.push(v => allowed_types.includes(v.type));
    }


    var tagSelectors = tokens.filter(v => /^#[a-z]+/i.test(v));
    console.log('tagSelectors', tagSelectors);

    var zoneSelectors = tokens.filter(v => /^@[a-z]+/i.test(v));
    console.log('zoneSelectors', zoneSelectors);
    let allowed_zones = [ZONES.play];
    if (zoneSelectors.length) {
      allowed_zones = [];
      if (zoneSelectors.includes('@deck')) {
        allowed_zones.push(ZONES.deck);  
      }
      if (zoneSelectors.includes('@hand')) {
        allowed_zones.push(ZONES.hand);  
      }
      if (zoneSelectors.includes('@play')) {
        allowed_zones.push(ZONES.play);  
      }
      if (zoneSelectors.includes('@grave')) {
        allowed_zones.push(ZONES.grave);  
      }
      if (zoneSelectors.includes('@aside')) {
        allowed_zones.push(ZONES.aside);  
      }
      if (zoneSelectors.includes('@secret')) {
        allowed_zones.push(ZONES.secret);  
      }
    }
    console.log('zones', allowed_zones);
    filters.push(v => allowed_zones.includes(v.zone));

    //property selectors only NARROW the search, so its AND
    let propRegexp = /^\.[0-9a-z]+((=|!=|<|>|<=|>=)[0-9a-z]+){0,1}$/i;
    //.test('.prop<42')
    var propSelectors = tokens.filter(v => propRegexp.test(v));
    console.log('propSelectors', propSelectors);
    let propFilters = propSelectors.map(selector => {
        let [
          _match, // destructuring will throw, if regex match fails
          propertyName,
          operator,
          comparisonValue
        ] = selector.match(/^\.([0-9a-z]+)(!=|<=|>=|<|>|=)?(.*)$/);
       
       if (!operator) {
         return v => !!v.propertyName;
       }
       if (!comparisonValue) throw new SyntaxError('Selector must have comparison value, when comparison operator is provided');
       // add type/NaN checking - as only Numbers should allow < and >       
       let ops = {
         '<': (v) => v[propertyName] < comparisonValue,
         '>': (v) => v[propertyName] > comparisonValue,
         '>=': (v) => v[propertyName] >= comparisonValue,
         '<=': (v) => v[propertyName] <= comparisonValue,
         '=': (v) => v[propertyName] === comparisonValue || new RegExp('^' + comparisonValue + '$', 'i').test(v[propertyName]), 
         '!=': (v) => v[propertyName] != comparisonValue,
       };       
       return ops[operator];
       //return new Function('v', `v.${propertyName} ${operator} ${comparisonValue}`);
    });
    //return tokens;  
    
    let all_cards = [...this.deck1, ...this.deck2];
    console.log(allowed_types, filters[0].toString());
    //console.log(all_cards.map(v=>v.type));
    return [...filters, ...propFilters].reduce((a,v) => a.filter(v), all_cards);
  }
}

let s = new Board2(arr1, arr2, p1, p2);

//console.log(s.$('any card @deck .cost #taunt #divineShield', p2).map(v=>v.name));
console.log(s.$(p2, 'any @deck minion .race=beast').map(v=>v.cost + ' ' + v.name));
