import {
    ZONES,
    CARD_TYPES,
    TAGS,
    // PLAYERCLASS,
    EVENTS
} from '../data/constants2';

import {
    effectReducer,
    EffectTarget
} from './effects';

type Player = any;
type UserFunction = (...a: any[]) => void;

type CardDefinition = {
    id: string;
    _info: string;
    text: string;
    type: 'MINION' | string;
    name: string;
    playerClass: 'WARRIOR' | string;
    rarity: 'RARE' | string;
    collectible: boolean;

    cost?: number;
    attack?: number;
    health?: number;
    armor?: number

    tags?: string[];
    target?: string;
    play?: UserFunction;
    death?: UserFunction[];
    // _triggers_v1: UserFunction[];
    //aura:,
    //enrage,
    overload?: number;
    xxx?: any,
};

interface BaseCardMetadata extends EffectTarget {
    id: string;
    // dbfId?: string;

    type: string;
    name: string;
    text: string;
    // targetingArrowText?: string;

    playerClass: string; // .cardClass seems to be missing on some cards
    // multiclass:
    rarity: string;

    cost: number;
    // overload?: number;

    // play?: (a: any) => void;
    // target?: string;
    //this.chooseOne = ???
    //this.joust = ???

    zone: string;
    owner: Player; // Player

    card_id: number;
}
declare var BaseCard: {
    new(definition: CardDefinition, owner: Player): BaseCardMetadata;
}

type MapString<T> = {
    [index: string]: T;
}
const CardDefinitionsIndex = {

} as MapString<CardDefinition>;
let card_id = 1;

// do we really need to couple card & player & eventBus
function createCard (id: string) {
    let card = CardDefinitionsIndex[id];
    if (!card) throw `Cannot find card with ID ${id}`;

    let structor = {
      [CARD_TYPES.minion]: Card.Minion,
      [CARD_TYPES.hero]: Card.Hero,
      [CARD_TYPES.weapon]: Card.Weapon,
      [CARD_TYPES.spell]: Card.Spell,
      [CARD_TYPES.power]: Card.Power,
      [CARD_TYPES.enchantment]: Card.Enchantment,
    }[card.type];

    let new_card = new structor(card, player, game);
    return new_card;
  }

