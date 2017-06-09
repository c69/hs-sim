
//consider splitting this, to somehow simplify signature
function applyBuff ({/* card or lambda-buff*/ card, target, $, game, type = 'buff'}) {
    //console.log(card);
    
    //console.log(target);
    //console.log(this.effect, '_______');
    let effect = card.effect || card;
    let attack_bonus = (typeof effect.attack !== 'function') ? effect.attack : effect.attack({target, $, game});

    let cost_modifier = typeof effect.cost === 'number' ? effect.cost : function (v, card) {
      return effect.cost(v, {target, $, game});    
    };

    let container = type === 'aura' ? target.incomingAuras : target.buffs;
    container.push({
        attack: attack_bonus,
        cost: cost_modifier,
        tags: effect.tags,

        //? zone: ??? -- is needed for Magma Giant 
        _by: card,
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

module.exports = applyBuff;