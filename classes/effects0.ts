import {
    Cards
} from '../data/constants';


/**
 * This function calculates final value of attribute
 *  after applying all currently active buffs on the card
 */
export function getter_of_buffed_atribute(this: Cards.Card, prop: string, initialValue: number) {
    if (!this.tags.length) return initialValue;

    let modifiers = this.tags.filter((v): v is Cards.LegacyBuff =>
        typeof v === 'object' && v.effects && (prop in v.effects));
        
    if (!modifiers.length) {
        //console.log(this.tags);
        return initialValue;
    }
    //console.log(modifiers.length, this.buffs.length, this.incomingAuras.length);
    //console.log(modifiers, this.tags);

    let new_value = modifiers.reduce((a, v) => {
        let mutator = v.effects[prop];
        if (typeof mutator === 'number') {
            a += mutator;
        } else if (typeof mutator === 'function') {
            a = mutator(a);
        }
        return a;
    }, initialValue);

    console.log(`${this.zone} ${this.name} ${this.card_id}'s ${prop} is modified from ${initialValue} to ${new_value}`);
    return new_value > 0 ? new_value : 0;
}
