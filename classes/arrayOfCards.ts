export default class ArrayOfCards extends Array {
    constructor () {
      super();
    }
    /**
     * Find and return immediately adjacent minions
     * // in theory this could/should be generalized to work with hand
     * // but this DEFINITELY needs to take into account
     * // current .zone and .position
     * // instead of the board index (i.e.: order of play)
     * @param {Card} minion A pivoting minion
     * @returns {ArrayOfCards} 0..2 matching minions
     */
    adjacent (minion) {
      let minions = this.filter(v => v.owner === minion.owner && v.zone === minion.zone);
      let i = minions.findIndex(v => v === minion);

      return (new (this.constructor as any)()).concat([minions[i - 1], minions[i + 1]]).filter(v => v);
    }
    /**
     * Helper for "other" and "excluding this" keywords
     * @param {Card} card Card to exclude
     * @returns {ArrayOfCards} 0..* Remaining cards
     */
    exclude (card) {
      return this.filter(v => v !== card);
    }
    /**
     * Find and return random card from current ArrayOfCards
     * @returns {ArrayOfCards} 1 matching minions
     */
    getRandom () { // i'd like signature to be getRandom(n) where n is number of distinct random members
      if (!this.length) return this;
      let random_idx = Math.floor(Math.random() * this.length);
      let v = this[random_idx];
      return (new (this.constructor as any)()).concat(v);
    }
    // call-through Card methods
    dealDamage (n: number) {
        console.log(`damaging ${this.length} minions`);
        this.forEach(v => v.dealDamage(n));
    }
    dealDamageSpell (n: number) {
        this.forEach(v => v.dealDamageSpell(n));
    }
    destroy (n: number) {
        this.forEach(v => v.destroy(n));
    }
    silence (n: number) {
        this.forEach(v => v.silence(n));
    }
}
