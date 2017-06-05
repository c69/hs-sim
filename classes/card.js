'use strict';
// @ts-check

const {
    ZONES,
    CARD_TYPES: TYPES,
    TAGS,
    PLAYERCLASS,
    EVENTS
} = require('../data/constants.js');

let card_id = 1;

class Card {
    constructor (cardDef, owner, eventBus) {
      if (!eventBus) throw new RangeError('EventBus required');
      this.eventBus = eventBus;

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

      this.play = cardDef.play;
      this.target = cardDef.target;
      //this.chooseOne = ???
      //this.joust = ???

      this.buffs = (cardDef.tags || []).slice(0);
      this.auras = []; // consider rename
      //this.tags is a getter
      
      if (cardDef.death) {
        this.buffs.push({//potentially shuld be .concat, as potentially card can have multiple deathrattles, even initially
          death: cardDef.death  
        });
      } 
      if (cardDef._trigger_v1) {
        this.buffs.push({ //potentially shuld be .concat, as potentially card can have multiple triggers
          trigger: cardDef._trigger_v1  
        });
      }
      this.aura = cardDef.aura;

      this.zone = ZONES.deck;
      this.owner = owner;

      this.card_id = card_id++; 
    }
    get tags () {
      let real_store = this.buffs;  
      //console.log(`card.tags: #${this.card_id}`);
      // -- this line is INCORRECT -- if (real_store.find(v => v === TAGS.silence)) return [TAGS.silence];
      
      //console.log(`card.tags returned: ${this.buffs}`);
      return [].concat(this.buffs, this.auras);  
    }
    _draw () {
        if (this.zone !== ZONES.deck) throw `Attempt to draw ${this.name} #${this.card_id} NOT from deck, but from: ${this.zone}`;
        this.zone = ZONES.hand;
    }
    _play () {
        if (this.type === TYPES.enchantment) {
            // no idea from which zone to play it ..
        } else {
            if (this.zone !== ZONES.hand) throw `Attempt to play card NOT from hand: ${this.name} #${this.card_id}, but from: ${this.zone}`;
        }
        this.zone = ZONES.aside;

        // todo: consider splitting this IF so proper event could be emitted
        if (this.type === TYPES.minion || this.type === TYPES.weapon) {
            this.zone = ZONES.play;
        } else if (this.type === TYPES.spell) {
            //todo: implements secrets
            this.zone = this.isSecret ? ZONES.secret : ZONES.grave;
        } else if (this.type === TYPES.enchantment) {
            this.zone = ZONES.play;
        } else {
            throw `Played card of unplayable type:${this.type}`;
        }
    }
    _summon () {  
      this.zone = ZONES.play;
       
      this.eventBus.emit(EVENTS.minion_summoned, {
        target: this
      });
  
      //console.log(`card.js :: summoned ${this.name} for ${this.owner.name}`);
    }
    _mill () {
        this.zone = ZONES.grave;
    }
    _die () {
        console.log(`☠️ ${this.type.toLowerCase()} died: ${this.owner.name}'s ${this.name}`);
        //this.death && this.death({self: this, $: game.board.$, game}); // deathrattle
        this.zone = ZONES.grave;
    }
    _copy () {
        let copy = new this.prototype.constructor(this, this.owner);
        // copy.tags[] are DIRTY !
        copy.zone = ZONES.aside; 
    }
    _damageApply (n, type = '') {
      if (!Number.isInteger) throw new RangeError(`Damage must be integer number, instead got ${n}`);
      let was = this.health;
      
      if (n > 0 && this.tags.includes(TAGS.divineShield)) {
        this.buffs = this.buffs.filter(v => v !== TAGS.divineShield); // = "removeTag"
        console.log(`(!) ${this.name} loses ${TAGS.divineShield} !`);
      } else {
        this.health -= n; // replace with damage buff
      }
      let received_damage = was - this.health;
      received_damage > 0 && console.log(`${type && '🔥 '}${this.name} takes ${received_damage} ${type} damage!`); 

      if (received_damage) {
        this.eventBus.emit(EVENTS.character_damaged, {
          target: this,
          amount: received_damage  
        });  
      }
      
      return this; // or return received_damage; ?
    }
    // public API
    dealDamage (n) {
        this._damageApply(n);
        //console.log(`🔥 ${this.name} takes ${was - this.health} damage!`);
    }
    dealDamageSpell (n) {
        this._damageApply(n, 'spell');
        //console.log(`🔥 ${this.name} takes ${was - this.health} spell damage!`);
    }
    destroy () {
        this.buffs.push(TAGS._pendingDestruction);
        //console.log(`🔥 ${this.name} was marked for destroy!`);
    }
    silence () {
      console.log(`${this.owner.name}'s ${this.name} #${this.card_id} got SILENCED!`);  
      this.buffs.push(TAGS.silence);

      // super dirty solution for silencing triggers (copy paste from game.js deathsweep) 
      if (this._listener) {
        this.eventBus.removeListener(this._listener[0], this._listener[1]);
        delete this._listener;
      }  
    }
    isDamaged () {
        return this.health < this.healthMax;     
    }
    isAlive () { // replace with death sweep in game
        return this.health > 0 && !this.tags.includes(TAGS._pendingDestruction);
    }
    toString () {
        return `[Object Card: ${this.name} #${this.card_id}]`;
    }
}

class Minion extends Card {
    constructor (cardDef, ...args) {
      super(cardDef, ...args);
      if (this.type !== TYPES.minion) throw new RangeError(
          `Card definition has type: ${this.type}, expected: ${TYPES.minion}`);
      
      this.attackBase = cardDef.attack || 0;
      this.health = cardDef.health || 0;
      this.healthMax = this.health; // in the beginning, all characters are at full health
      this.race = cardDef.race; // or undefined   
   
      this.isReady = false; //applies only to minion - initial ZZZ / sleep
      this.attackedThisTurn = 0; //applies to: Minion, Hero, Power
    }
    get attack () {
      //DESIGN BUG: such implementation does not allow to SET attack, only to modify.  
      // getter inside of getter ..
      let mostRecentSilence = this.tags.lastIndexOf(TAGS.silence);
      if (mostRecentSilence === -1) mostRecentSilence = 0;
      let modifiers = this.tags.slice(mostRecentSilence).filter(v => v.attack);
      if (!modifiers) return this.attackBase;  
      return this.attackBase + modifiers.reduce(((a,v) => a + v.attack), 0)   
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
      this.durability = cardDef.durability || 0;   
    }
}
class Hero extends Card {
    constructor (cardDef, ...args) {
      super(cardDef, ...args);
      if (this.type !== TYPES.hero) throw new RangeError(
          `Card definition has type: ${this.type}, expected: ${TYPES.hero}`);
      
      this.attackBase = cardDef.attack || 0;
      this.health = cardDef.health || 0;
      this.healthMax = this.health; // in the beginning, all characters are at full health
      
      this.attackedThisTurn = 0; //applies to: Minion, Hero, Power
      
      this.armor = cardDef.armor || 0;
      //this.power = card_id ? or this.tags[battlecry () {change_power(card_id)}]   
    }
    get attack () {
      //ARCHITECTURE BUG: currently getter must be copy/pasted bewteen hero and minion
      // for now i'll just ignore buffs for Hero 
      return this.attackBase;
    }
    _die () {
        super._die();
        this.owner.loose();
    }
}
class Power extends Card {
    constructor (cardDef, ...args) {
      super(cardDef, ...args);
      if (this.type !== TYPES.power) throw new RangeError(
          `Card definition has type: ${this.type}, expected: ${TYPES.power}`);

      this.attackedThisTurn = 0; //applies to: Minion, Hero, Power   
    }
}
class Enchantment extends Card {
    constructor (cardDef, ...args) {
      super(cardDef, ...args);
      if (this.type !== TYPES.enchantment) throw new RangeError(
          `Card definition has type: ${this.type}, expected: ${TYPES.enchantment}`);
      
      //console.log('EXCH', cardDef);
      //DESIGN BUG: clunky object shape
      // todo: finalize when SET attack/health/cost will be implemented
      this.effect = {
          //modify numbers
          attack: cardDef.attack,
        //   health: cardDef.health,
        //   durability: cardDef.durability,
        //   cost: cardDef.cost,
          //add fn to array
        //   death: cardDef.death,
          //set number to
        //   attackEquals: cardDef.attackEquals,
        //   healthEquals: cardDef.healthEquals,
        //   costEquals: cardDef.costEquals,
          //ownerEquals: cardDef.ownerEquals
          // ~
          // resource = 'health'; //vs default, mana
          
      }
    }
    //consider splitting this, to somehow simplify signature
    apply ({target, $, game, type = "buff"}) {
          //console.log(target);
          super._play();
          //console.log(this.effect, '_______');
          let attack_bonus = (typeof this.effect.attack !== 'function') ? this.effect.attack : this.effect.attack({target, $, game});
          
          let container = type === 'aura' ? target.auras : target.buffs;
          container.push({
              attack: attack_bonus,
              //tags: ???tags
              _by: this,
              toString () {
                  return `[Object Buff: ${this._by.name} #${this._by.card_id}]`
              }  
          });
          //console.log(target.name, container);
          if (type === 'aura') {
              //console.log(`Aura refresh: ${this.name} on ${target.owner.name}'s ${target.name} by [source?]`);  
          } else {
              console.log(`${target.owner.name}'s ${target.name} got buffed with ${this.name}`);        
          }
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