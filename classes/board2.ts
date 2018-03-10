import ArrayOfCards from './arrayOfCards';

import {
    ZONES,
    CARD_TYPES as TYPES,
    TAGS,
    PLAYERCLASS,
    AoC as AoC_b,
    Cards
} from '../data/constants';

import { MapString } from '../shared.interface';
import { Card } from './card';
import Player from './player';

type CardFilterFunction = (a: Cards.Card) => boolean;

type FilterAccumulator = {
    owners: Set<Player>;
    types: Set<string>;
    zones: Set<string>;
    tags: Set<string>;
    props: null;
    ownPlayer: Player;
    enemyPlayer: Player;
}
/** reducer for simple enum tokens */
function buildFilterSets (a: FilterAccumulator, t: string) {
    // TODO: there is a bug with "own hero" method :(
    switch (t) {
        // -- PLAYERS --
        case 'any':
            a.owners.clear();
            break;
        case 'own':
            a.owners.add(a.ownPlayer);
            break;
        case 'enemy':
            a.owners.add(a.enemyPlayer);
            break;
        // -- TYPES --
        case 'card':
            a.types.clear();
            break;
        case 'minion':
            a.types.add(TYPES.minion);
            break;
        case 'hero':
            a.types.add(TYPES.hero);
            break;
        case 'character':
            a.types.add(TYPES.hero).add(TYPES.minion);
            break;
        case 'weapon':
            a.types.add(TYPES.weapon);
            break;
        case 'spell':
            a.types.add(TYPES.spell);
            break;
        // -- ZONES --
        case '@deck':
            a.zones.add(ZONES.deck);
            break;
        case '@hand':
            a.zones.add(ZONES.hand);
            break;
        case '@aside':
            a.zones.add(ZONES.aside);
            break;
        case '@play':
            a.zones.add(ZONES.play);
            break;
        case '@grave':
            a.zones.add(ZONES.grave);
            break;
        default:
            break;
    }
    return a;
}

//private debug vars
let _$_count = 0;
let _$_all_selectors: any = {};
let _$_count_slow_path = 0;
let _$_slow_selectors: any = {};

interface QuerySearch {
    $<T extends Cards.Card = Cards.Card>(p: Player, s: string): AoC_b<T>;
    $(p: Player, s: '*'): AoC_b<Cards.Card>;
}

class Board implements QuerySearch {
    deck1: Cards.Card[];
    deck2: Cards.Card[];
    player1: Player;
    player2: Player;

  constructor (deck1: Cards.Card[], deck2: Cards.Card[], player1: Player, player2: Player) {
    this.deck1 = deck1;
    this.deck2 = deck2;
    this.player1 = player1;
    this.player2 = player2;
  }
  /**
   * @private
   * Debug method which counts total calls to $ during process lifetime.
   */
  static _profile () {
    return {
      _$_count,
      _$_all_selectors,
      _$_count_slow_path,
      _$_slow_selectors
    }
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
   *   e.g.: 'minion .attack<3' or 'minion .race=murloc' or 'character .isReady'
   * - (NOT IMPLEMENTED) Negation: [!self|!.prop] for the real world cases when you need to exclude something

   * @param player Could (and should) be curried for card helper function (player is self.owner)
   * @param selector_string Refer to syntax above
   */
   $ <T extends Cards.Card = Cards.Card>(player: Player, selector_string: string): AoC_b<T> {
   // $ (player: Player, selector_string: string): ArrayOfCards {
    _$_count += 1;

    //console.log(`- $ -- SELECTING ${selector_string} for ${player.name} | bound to ${this}`);

    if (typeof selector_string !== 'string') throw new TypeError(`String expected, instead got: ${selector_string}. Full list of arguments: this: ${this}, ${player}, ${selector_string}`);

    let [
      ownPlayer,
      enemyPlayer
    ] = this.player1 === player ? [this.player1, this.player2] : [this.player2, this.player1];

    _$_all_selectors[selector_string] = _$_all_selectors[selector_string] ? _$_all_selectors[selector_string] + 1 : 1;

    const all_cards: Cards.Card[] = [].concat(this.deck1, this.deck2);

    // before you ask: Why are you merging two deck, and then searching for owner ?!
    // - think: minion can be stolen
    let f = ({
      // es3/es5 functions are slightly faster than arrows :(
      // shaved 200ms (7.00s to 6.80s) on 100 runs in Node6
      // should consider memoisation/caching (with turn-tick-phase key)
      //try to optimize for most used cases ? and then maybe move this strings to constants

/*
      'minion': function (v) { return v.zone === ZONES.play && v.type === TYPES.minion;},
      'character': function (v) { return v.zone === ZONES.play && (v.type === TYPES.minion || v.type === TYPES.hero);},
      'own minion': function (v) { return v.zone === ZONES.play && v.owner === ownPlayer && v.type === TYPES.minion;},
      'enemy minion': function (v) { return  v.zone === ZONES.play && v.owner === enemyPlayer && v.type === TYPES.minion;},
      'own character': function (v) { return  v.zone === ZONES.play && v.owner === ownPlayer && (v.type === TYPES.minion || v.type === TYPES.hero);},
      'enemy character': function (v) { return  v.zone === ZONES.play && v.owner === enemyPlayer && (v.type === TYPES.minion || v.type === TYPES.hero);},
      // heroes are OFTEN in the beginning of the deck (cough.. "premature optimization")
      'own hero': function (v) { return v.type === TYPES.hero && v.zone === ZONES.play && v.owner === ownPlayer},
      'enemy hero': function (v) { return v.type === TYPES.hero && v.zone === ZONES.play && v.owner === enemyPlayer},

      //:validTarget for attack or missiles
      //:isAlive ? :isDamaged ?
      'enemy character .health>0': function (v) { return v.zone === ZONES.play && v.owner === enemyPlayer && v.health > 0 && (v.type === TYPES.minion || v.type === TYPES.hero);}
*/
    } as MapString<(a: any) => boolean>)[selector_string];

    if (f) {
      return (new ArrayOfCards).concat(all_cards.filter(f)) as AoC_b<T>;
    }

    _$_count_slow_path += 1;
    _$_slow_selectors[selector_string] = _$_slow_selectors[selector_string] ? _$_slow_selectors[selector_string] + 1 : 1;

    // '*' is a "slow" selector, but itss simple conceptually. I want to use it for auras, till API stabilization
    // the ONLY place where we use * selector (today) is aura refresh..
    if (selector_string === '*') {
        return (new ArrayOfCards).concat(all_cards) as AoC_b<T>;
    }


    const isVaidSelector = /^(any|own|enemy)?\s*(card|minion|hero|character|weapon|spell)?\s*(@(deck|hand|play|grave|aside|secret))?/.test(selector_string)
    if (!isVaidSelector) throw "Selector syntaxt invalid";

    let tokens = selector_string.split(/\s+/);

    const board2xxx = tokens.reduce(buildFilterSets, {
        ownPlayer: ownPlayer,
        enemyPlayer: enemyPlayer,
        owners: new Set() as Set<Player>,
        types: new Set() as Set<string>,
        zones: new Set() as Set<string>,
        tags: new Set() as Set<string>,
        props: null
    });

    if (!board2xxx.zones.size) {
        board2xxx.zones.add(ZONES.play);
    }
    // if (!board2xxx.types.size) {
    //     board2xxx.types.add(TYPES.card); // -- might be needed if we add Game and Player as entity
    // }

    let filters = [];

    // zone is the most discriminating of light weight checks
    // type less so - because 99% of @play are minions or heroes
    if (board2xxx.types.size) {
        filters.push(function (v: Cards.Card) {
            return board2xxx.zones.has(v.zone) && board2xxx.types.has(v.type);
        })
    } else {
        filters.push(function (v: Cards.Card) {
            return board2xxx.zones.has(v.zone);
        })
    }
    if (board2xxx.owners.size) {
        filters.push(function (v: Cards.Card) {
            return board2xxx.owners.has(v.owner);
        })
    }


    //tag selectors only NARROW the search, so its AND
    var tagSelectors = tokens.filter(v => /^#[a-z]+/i.test(v));
    //console.log('tagSelectors', tagSelectors);

    // this piece of code was almost never tested, and had at least 3 bugs..
    let tagFilters = tagSelectors.map((selector): CardFilterFunction => {
        let tagName = selector.slice(1);
        // most of the cases are commented out because they do not work
        switch(tagName) {
            // case 'battlecry':
            // return (v) => typeof(v.play) === 'function';
            // case 'deathratle':
            // TODO: fix
            // here we can see asssumption that .tags could be
            // EITHER string[] or Buff[] !
            // such assumption will probably be wrong
            // return (v) => typeof(v.death) === 'function' || v.tags.some(v1 => !!v1.death);
            // case 'aura':
            // return (v) => typeof(v.aura) === 'object';
            // case 'trigger':
            // return (v) => typeof(v.trigger) === 'function';
            // case 'overload':
            // return (v) => !!v.overload;

            default:
            return (v) => v.tags.includes(TAGS[tagName]);
        }
    });

    //property selectors only NARROW the search, so its AND
    let propRegexp = /^\.[0-9a-z]+((=|!=|<|>|<=|>=)[0-9a-z]+){0,1}$/i;
    //.test('.prop<42')
    var propSelectors = tokens.filter(v => propRegexp.test(v));
    //console.log('propSelectors', propSelectors);
    let propFilters = propSelectors.map((selector): CardFilterFunction => {
       let [
          _match, // destructuring will throw, if regex match fails
          propertyName,
          operator,
          comparisonValue
       ] = selector.match(/^\.([0-9a-z]+)(!=|<=|>=|<|>|=)?(.*)$/);

       if (!operator) {
         return v => !!v[propertyName];
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
       } as {[key: string]: (v: Cards.Card) => boolean};
       return ops[operator];
    });
    //return tokens;

    //console.log(allowed_types, filters[0].toString());
    ////console.log(all_cards.map(v=>v.type));
    //console.log(all_cards.map(v=>v.zone+' '+v.name));
    //console.log(all_cards.length)


    //let result = [...filters, ...tagFilters, ...propFilters].reduce((a,v) => a.filter(v), cards_in_zone);
    let result = filters.concat(tagFilters, propFilters).reduce((a,v) => a.filter(v), all_cards);


    //console.log(selector_string, result);

    return (new ArrayOfCards()).concat(result) as AoC_b<T>;
  }
}

export {
    Board,
    ArrayOfCards
};
