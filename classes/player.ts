import {
  CARD_TYPES,
  ZONES
} from '../data/constants';

import Hand from './hand';
import Deck from './deck';

export default class Player {
  name: string;

  deck: Deck = null;//deck; //$('own @deck');
  hand: Hand;

  manaCrystals: number = 0;
  /** @deprecated */ mana: number;
  fatigue: number = 1;
  lost: boolean = false;

  constructor (name: string) {
    this.name = name;

    this.deck = null;//deck; //$('own @deck');
    this.hand = new Hand(this); //$('own @hand');

    this.manaCrystals = 0;
    this.mana = this.manaCrystals;
    this.fatigue = 1;
    this.lost = false;
  }
  get hero () {
    //console.log('trying to GET .hero from Player ' + this.name);
    let r = this.deck._arr.find(v => v.type === CARD_TYPES.hero && v.zone === ZONES.play); // probably hero should be injected by Board ..
    //console.log(r);
    return r || this.deck._arr.find(v => v.type === CARD_TYPES.hero && v.zone === ZONES.grave);
  }
  draw (n: number) {
    console.log(`player ${this.name} draws a card.. (of ${this.deck.size} remaining)`);
    var newCards = this.deck.draw(n);
    if (!newCards.length) this.hero.dealDamage(this.fatigue++);

    newCards.forEach(card => (
      this.hand.add(card)
    ), this);
  }
  loose () {
    console.warn(`player ${this.name} LOST the game`);
    this.lost = true;
  }
}
