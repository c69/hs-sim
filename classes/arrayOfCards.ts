import {
    Cards,
    AoC
} from './../data/constants';

export default class ArrayOfCards<T extends Cards.Card> extends Array implements AoC {
    'constructor': typeof ArrayOfCards;
    constructor () {
        super();
    }
    /**
     * Find and return immediately adjacent minions
     * // in theory this could/should be generalized to work with hand
     * // but this DEFINITELY needs to take into account
     * // current .zone and .position
     * // instead of the board index (i.e.: order of play)
     * @param minion A pivoting minion
     * @return 0..2 matching minions
     */
    adjacent (minion: Cards.Card) {
        let minions = this.filter(v => v.owner === minion.owner && v.zone === minion.zone);
        let i = minions.findIndex(v => v === minion);

        return (new this.constructor()).concat([minions[i - 1], minions[i + 1]]).filter(v => v) as AoC<T>;
    }
    /**
     * Helper for "other" and "excluding this" keywords
     * @param card Card to exclude
     * @return 0..* Remaining cards
     */
    exclude (card: Cards.Card) {
        return this.filter(v => v !== card) as AoC<T>;
    }
    /**
     * Find and return random card from current ArrayOfCards
     * @return collection of 1 matching minions
     */
    getRandom () { // i'd like signature to be getRandom(n) where n is number of distinct random members
        const random_idx = Math.floor(Math.random() * this.length);
        const v = this[random_idx] || this;

        return (new this.constructor()).concat(v) as AoC<T>;
    }
    // call-through Card methods
    dealDamage (n: number) {
        console.log(`damaging ${this.length} minions`);
        this.forEach(v => v.dealDamage(n));
    }
    dealDamageSpell (n: number) {
        this.forEach(v => v.dealDamageSpell(n));
    }
    destroy () {
        this.forEach(v => v.destroy());
    }
    silence () {
        this.forEach(v => v.silence());
    }
}
