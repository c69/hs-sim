import {
  CARD_TYPES,
  ZONES,
  Types,
  Cards
} from '../data/constants';

import { Card } from './card';
import Hand from './hand';
import Deck from './deck';

export default class Player implements Cards.Player {
  card_id: number;
  name = 'PLAYER_UNKNOWN';
  zone: Types.ZonesAllCAPS = 'ASIDE';
  owner: Player = null;
  type: 'PLAYER';
  tags: Cards.Card['tags'] = [];

  /** @deprecated */
  deck: Deck = null;//deck; //$('own @deck');
  /** @deprecated */
  hand: Hand;
  hero: null;

  manaCrystals: number = 0;
  mana: number = 0;
  fatigue: number = 1;
  lost: boolean = false;

  constructor (name: string) {
    // super(def, this, eb?!);
    this.card_id = 0;
    this.name = name;

    this.deck = null;//deck; //$('own @deck');
    this.hand = new Hand(this); //$('own @hand');

    this.manaCrystals = 0;
    this.mana = this.manaCrystals;
    this.fatigue = 1;
    this.lost = false;
  }
  draw (n: number) {

  }
  loose () {
    if (this.lost) throw 'Trying to loose the game twice - Infinite loop upon game end ?';
    console.warn(`player ${this.name} LOST the game`);
    this.lost = true;
  }
}
