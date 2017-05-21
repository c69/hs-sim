'use strict';
// @ts-check

const {
    ZONES,
    CARD_TYPES: TYPES,
    TAGS,
    PLAYERCLASS
} = require('../data/constants.js');

let card_id = 1;

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
      // this.tags.push(cardDef.death) // this.buffs.push(cardDef.death)
      this.trigger = cardDef.trigger;
      this.aura = cardDef.aura;

      this.zone = ZONES.deck;
      this.owner = owner;

      this.card_id = card_id++;  
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
        console.log(`☠️ ${this.type.toLowerCase()} died: ${this.owner.name}'s ${this.name}`);
        this.death && this.death({self, $, game}); // deathrattle
        this.zone = ZONES.grave;
    }
    _copy () {
        let copy = new this.prototype.constructor(this, this.owner);
        // copy.tags[] are DIRTY !
        copy.zone = ZONES.aside; 
    }
    // public API
    dealDamage (n) {
        console.log(`🔥 ${this.name} takes ${n} damage!`);
        this.health -= n; // replace with damage buff
        this.isStillAlive();
    }
    dealDamageSpell (n) {
        console.log(`🔥 ${this.name} takes ${n} spell damage!`);
        this.health -= n; // replace with damage buff
        this.isStillAlive();
    }
    buff (enchantment) {
        this.buffs.push(enchantment); // todo: check for duplicate buffs, etc
    }
    isStillAlive() { // replace with death sweep in game
        if (this.health < 1) this.die();
    }
    toString () {
        return `[Object Card: ${this.name}#${this.card_id}]`;
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
   
      this.isReady = false; //applies only to minion - initial ZZZ / sleep
      this.attackedThisTurn = 0; //applies to: Minion, Hero, Weapon, Power
    }
}
class Spell extends Card {
    constructor (cardDef, ...args) {
      super(cardDef, ...args);
      if (this.type !== TYPES.spell) throw new RangeError(
          `Card definition has type: ${this.type}, expected: ${TYPES.spell}`);
            
      //this.secret = cardDef.secret; //must be a function
      //this.quest = cardDef.quest; //must be a function
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

module.exports = {
    Card,
    Minion,
    Spell,
    Hero, // consider name clashes!,
    Weapon,
    Power,
    Enchantment
}