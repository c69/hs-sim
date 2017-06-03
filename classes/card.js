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
      //this.tags is getter
      
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
      if (real_store.find(v => v === TAGS.silence)) return [TAGS.silence];
      
      //console.log(`card.tags returned: ${this.buffs}`);
      return this.buffs;  
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
    summon () {  
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
        this._die();
        //console.log(`🔥 ${this.name} is being destroyed!`);
    }
    buff (enchantment) {
        if (typeof enchantment === 'string') {
            // if (Reflect.values(TAGS).includes(enchantment)) {
            //     this.buffs.push(enchantment); // check for duplicates
            //     return this;
            // } else if (let x = _getCardById(enchantment)) {
            //     this.buffs.push(x)
            //     return this;
            // };
        } else if (enchantment && typeof enchantment === 'object') {
            //this.buffs.push(enchantment);
            enchantment.apply(this); //why not .play ?
            return this;
        } else {
          throw new RangeError('String or Object expected');
        }
    }
    x_give (args, descr) {
      if (!Array.isArray(args)) throw new RangeError('Array expected');
      var card = this;
      card.buffs.concat(args);
    }
    silence () {
      console.log(`${this.name} got SILENCED!`);  
      this.buffs.push(TAGS.silence);

      // super dirty solution for silencing triggers (copy paste from game.js deathsweep) 
      if (this._listener) {
        this.eventBus.removeListener(this._listener[0], this._listener[1]);
        delete this._listener;
      }  
    }
    isStillAlive() { // replace with death sweep in game
        if (this.health < 1) this._die();
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
      
      this.baseAttack = cardDef.attack || 0;
      this.health = cardDef.health || 0;
      this.healthMax = this.health; // in the beginning, all characters are at full health
      this.race = cardDef.race; // or undefined   
   
      this.isReady = false; //applies only to minion - initial ZZZ / sleep
      this.attackedThisTurn = 0; //applies to: Minion, Hero, Power
    }
    get attack () {
      //DESIGN BUG: such implementation does not allow to SET attack, only to modify.  
      let modifiers = this.buffs.filter(v => v.attack);
      if (!modifiers) return this.baseAttack;  
      return this.baseAttack + modifiers.reduce(((a,v) => a + v.attack), 0)   
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
      
      this.baseAttack = cardDef.attack || 0;
      this.health = cardDef.health || 0;
      this.healthMax = this.health; // in the beginning, all characters are at full health
      
      this.attackedThisTurn = 0; //applies to: Minion, Hero, Power
      
      this.armor = cardDef.armor || 0;
      //this.power = card_id ? or this.tags[battlecry () {change_power(card_id)}]   
    }
    get attack () {
      //DESIGN BUG: such implementation does not allow to SET attack, only to modify.  
      let modifiers = this.buffs.filter(v => v.attack);
      if (!modifiers) return this.baseAttack;  
      return this.baseAttack + modifiers.reduce((a,v) => a + v, 0)   
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
      this.effect = {
          attack: cardDef.attack,
          health: cardDef.health,
          durability: cardDef.durability,
          cost: cardDef.cost,
          //owner: cardDef.owner --< unclear how to do
          death: cardDef.death
      }
    }
    apply ({target, $, game}) {
          //console.log(target);
          super._play();
          console.log(this.effect, '_______');
          let attack_bonus = (typeof this.effect.attack !== 'function') ? this.effect.attack : this.effect.attack({target, $, game});
          
          target.buffs.push({
              attack: attack_bonus,
              _by: this  
          });
          //console.log(target.name, target.buffs);        
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