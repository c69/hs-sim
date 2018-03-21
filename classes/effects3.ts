import {
    CARD_TYPES,
    TAGS,
    // TAGS_LIST,
    // KnownEnvConstants,
    // KnownMechanics,

    Cards,
    Types,
    Effects,
    // EVENTS,
    ZONES
} from '../data/constants';


// ----------------- line 15

type StatsAsMutators = Effects.StatsAsMutators;
type StatsAsNumbers = Effects.StatsAsNumbers;
type CardState = Effects.CardState;
type AnyPossibleBuff = Effects.AppliedBuff;


// --- was line 80 (= 65 lines total)


function _pickStats<T extends StatsAsNumbers, P extends keyof StatsAsMutators>(obj: T, props: P[]) {
    return props.reduce((a, v) => {
        a[v] = obj[v];
        return a;
    }, {} as T);
};

let ccc = 0;

export function computeState (card: Card_withEffects): CardState {
    let allBuffs = ([] as AnyPossibleBuff[]).concat(
        card._effects.original,
        card._effects.given,
        card._effects.incomingAuraEffects
    );

    // console.log(card._effects.original.map(v => `o ${v}`));
    // console.log(card._effects.given.map(v => `g ${v}`));
    // console.log(card._effects.incomingAuraEffects.map(v => `i ${v}`));


    let baseState: CardState = {
        stats: {...card._base.stats},
        tags: new Set([]),
        triggers: [],
        auras: [],
        deathrattles: []
    };
    if (!allBuffs.length) return baseState; // todo: health_&_damage

    const env = {
        self: card,
        host: card, // this is needed for mind control
        $: {}
    };


    if (allBuffs.length > 10) throw `OK.. time to debug`;
//    console.log(allBuffs.map(v => `${v}`));

    // the expensive ".lastIndexOf" with 0 as default
    let ignoreOlder = allBuffs.reduce((a, v, i) => {
        let hasSilence = false;
        if (Array.isArray(v)) {
            hasSilence = v.includes(TAGS.silence);
        } else if (v.result.tags) {
            hasSilence = v.result.tags.has(TAGS.silence);
        }

        return hasSilence ? i : a;
    }, 0);

    let activeBuffs = allBuffs.slice(ignoreOlder);

//    console.log(activeBuffs.map(v => `${v}`));

    const newState = (activeBuffs as AnyPossibleBuff[]).reduce((state, buff) => {
        if (typeof buff === 'string') throw `String buffs are not supported: ${buff}`;

        if (Array.isArray(buff)) {
            buff.forEach(t => state.tags.add(t));
            return state;
        }
//        if (buffCard.zone !== ZONES.play) throw `Zombie enchantment ${buff}`;

        [
            'cost',
            'attack',
            // --- TODO: damage-related stats are not ready for prime-time
            // 'health',
            // 'armor',
            // 'durability'
        ].forEach((k: 'cost'|'attack') => {
            const mutator = buff._by.effects[k];
            if (!mutator) return; // if mutator is 0, we also ignore it

            if (typeof mutator === 'function') {
                state.stats[k] = mutator(state.stats[k], env);
            } else if (typeof mutator === 'number') {
                state.stats[k] += mutator;
            }
        });

        if (buff.result.tags) {
            buff.result.tags.forEach(t => state.tags.add(t));
        }
        if (buff.result.tagsDelete) {
            buff.result.tagsDelete && buff.tagsDelete.forEach(t => state.tags.delete(t));
        }
//        state.triggers = state.triggers.concat(buff.on || []);
//        state.auras = state.auras.concat(buff.aura || []);
//        state.deathrattles = state.deathrattles.concat(buff.death || []);

        if (buff.effectType === 'aura') {
            console.log(buff);
            console.log(`adding ${buff} to state of the ${card}`);
            state.auras = [].concat(state.auras, buff);
            state.tags.add(TAGS.has_aura);
        } else {
            console.log(buff);
        }

        console.log(state);
        if(ccc++ > 70) throw ``;

        return state;
    }, baseState);

//    console.log(`${card} state auras.length`, newState.auras.length);
    return newState;
}
