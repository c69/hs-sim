'use strict';
// @ts-check

const {
    ZONES,
    CARD_TYPES: TYPES,
    TAGS,
    PLAYERCLASS
} = require('../data/constants.js');


class Board {
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
  $ (player, selector_string) {try{
    //console.log(`---SELECTING ${selector_string} for ${player.name} | bound to ${this}`);
    if (typeof selector_string !== 'string') throw new TypeError(`String expected, instead got: ${selector_string}. Full list of arguments: this: ${this}, ${player}, ${selector_string}`);
      
    let [ownPlayer, enemyPlayer] = this.player1 === player ? [this.player1, this.player2] : [this.player2, this.player1];

    let tokens = selector_string.split(/\s+/);
    let filters = [];

    //card owner: choose one - XOR 
    if (!tokens.includes('any')) {
      if (tokens.includes('enemy')) {
        filters.push(v => v.owner !== ownPlayer);  
      } else if (tokens.includes('own')) {
        filters.push(v => v.owner === ownPlayer);
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
      //console.log('types', allowed_types);
      filters.push(v => allowed_types.includes(v.type));
    }

    var zoneSelectors = tokens.filter(v => /^@[a-z]+/i.test(v));
    //console.log('zoneSelectors', zoneSelectors);
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
    //console.log('zones', allowed_zones);
    filters.push(v => allowed_zones.includes(v.zone));

    //tag selectors only NARROW the search, so its AND
    var tagSelectors = tokens.filter(v => /^#[a-z]+/i.test(v));
    //console.log('tagSelectors', tagSelectors);
    let tagFilters = tagSelectors.map(selector => {
       let tagName = selector.slice(1);
       switch(tagName) {
         case 'battlecry':
         return (v) => typeof(v.play) === 'function';
         case 'deathratle':
         return (v) => typeof(v.death) === 'function' || v.tags.some(v1=>!!v1.death);
         case 'aura':
         return (v) => typeof(v.aura) === 'function';
         case 'trigger':
         return (v) => typeof(v.trigger) === 'function';
         case 'overload':
         return (v) => !!v.overload;
         
         default:
         return (v) => v.tags.includes(TAGS[tagName]);
       }
    });
 
    //property selectors only NARROW the search, so its AND
    let propRegexp = /^\.[0-9a-z]+((=|!=|<|>|<=|>=)[0-9a-z]+){0,1}$/i;
    //.test('.prop<42')
    var propSelectors = tokens.filter(v => propRegexp.test(v));
    //console.log('propSelectors', propSelectors);
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
    });
    //return tokens;  
    
    let all_cards = [...this.deck1, ...this.deck2];
    //console.log(allowed_types, filters[0].toString());
    ////console.log(all_cards.map(v=>v.type));
    //console.log(all_cards.map(v=>v.zone+' '+v.name));
    //console.log(all_cards.length)
    let result = [...filters, ...tagFilters, ...propFilters].reduce((a,v) => a.filter(v), all_cards);
    //console.log(selector_string, result);
    //return result;
    return (new ArrayOfCards()).concat(result);
  }catch(err){console.warn(err)}}
}

class ArrayOfCards extends Array {
    constructor () {
      super();
    }
    getRandom () { // i'd like signature to be getRandom(n) where n is number of distinct random members
      let random_idx = Math.floor(Math.random() * this.length);
      return this[random_idx];
    }
    dealDamage (n) {
        this.forEach(v => v.dealDamage(n));
    }
    dealDamageSpell (n) {
        this.forEach(v => v.dealDamageSpell(n));
    }
    destroy (n) {
        this.forEach(v => v.destroy(n));
    }
}

module.exports = Board;