import {
    CARD_TYPES,
    TAGS,
    // TAGS_LIST,
    // KnownEnvConstants,
    // KnownMechanics,

    Cards,
    Types,
    // EVENTS,
    ZONES
} from '../data/constants';


// ----------------- line 15
namespace Effects {

type Tag = keyof typeof TAGS; //'taunt' | 'blabla';
type _Fn_mechanics_Placeholder = (o: any) => any;
type _Fn_condition = (o: any) => boolean;
type _Fn_mutator<T> = (n: T, o: any) => T;

type _singleOrArray<T> = T | T[];
type _asMutators<T> = {
    [K in keyof T]: T[K] | _Fn_mutator<T[K]>;
};
export type StatsAsNumbers = {
    cost: number;
    attack?: number;
    health?: number;
    armor?: number;
    durability?: number;
    [k: string]: number; // TODO: check that this works
};
export type StatsAsMutators = _asMutators<StatsAsNumbers>;
type HealthMaxMixin = {
    healthMax?: number;
}
type AuraContainer = {
    target: string;
    buffId?: string;
    tags?: string[];
    zone: Types.ZonesAllCAPS;
}
type TriggerContainer = {
    event: string;
    action: _Fn_mechanics_Placeholder;
    matches?: string;
    if?: _Fn_condition;
}
type DeathContainer = {
    death: _Fn_mechanics_Placeholder;
}
type EffectContainers = {
    aura?: AuraContainer;
    death?: DeathContainer;
    on?: TriggerContainer;
}
type _arraysOrSingle<T> = {
    [K in keyof T]: _singleOrArray<T[K]>;
}
type _onlyArrays<T> = {
    [K in keyof T]: T[K][];
}
type EffectDefinitionMixin = _arraysOrSingle<EffectContainers>;
type EffectMixin = _onlyArrays<EffectContainers>;

type BuffDefinition = StatsAsMutators & {
    card_id: number; // one mandatory property to make sure type is non-weak
}
type BuffContainer = StatsAsMutators & {
    card_id: number; // one mandatory property to make sure type is non-weak

    tags?: Set<Tag>;
    tagsDelete?: Set<Tag>;
} & EffectMixin;

export type AnyPossibleBuff = Tag[] | BuffContainer;
export type CardState = {
    // consider union for (Hero, Minion, Weapon, Spell)
    // also - stats for Game or Player would be totally different !
    stats: StatsAsNumbers & HealthMaxMixin;

    tags: Set<string>;

    triggers: TriggerContainer[];
    auras: (AuraContainer & { auraActivated?: Cards.Enchantment })[];
    deathrattles: DeathContainer[];

    // refresh looks dangerous in this form,
    // and .incomingAuras here is only as a draft to implement Small-Time Buccaneer
    // which might not work, because we now expect
    // .auraActivated (buff card) inside of incomingAuras,
    // and not simply a string id
    // refresh: _asMutators<StatsAsNumbers & {incomingAuras: BuffOrTags[]}>; // woot
}

}

type StatsAsMutators = Effects.StatsAsMutators;
type StatsAsNumbers = Effects.StatsAsNumbers;
type CardState = Effects.CardState;
type AnyPossibleBuff = Effects.AnyPossibleBuff;

type Card_withEffects = {
    card_id: number;
    type: Types.CardsAllCAPS;
} & Readonly<StatsAsNumbers> & {
    readonly tags: Set<string>;

    _base: CardState;
    _current: CardState;
    _effects: {
        // 5 collections are a good indication of
        // our incomplete understanding of the problem :(
        // real question is - do we even need ANY of them ?
        log: AnyPossibleBuff[];
        original: AnyPossibleBuff[];
        given: AnyPossibleBuff[];
        temporary: AnyPossibleBuff[];
        auraEffects: AnyPossibleBuff[];
    }
};


// --- was line 80 (= 65 lines total)

// let __TEST_ME: BuffContainer = {
//     card_id: 11,
//     cost: 2,
//     // on: [42]
//     on: [{
//         event: '',
//         action () {}
//     }]
// }

function _pickStats<T extends StatsAsNumbers, P extends keyof StatsAsMutators>(obj: T, props: P[]) {
    return props.reduce((a, v) => {
        a[v] = obj[v + 'Base'];
        return a;
    }, {} as T);
};

export function applyEffects (card: Card_withEffects): CardState {
    let allBuffs = ([] as AnyPossibleBuff[]).concat(card._effects.given, card._effects.auraEffects);
    if (!allBuffs.length) return null;


    let baseState: CardState = {
        stats: {
            cost: null
        },
        tags: new Set(),
        triggers: [],
        auras: [],
        deathrattles: []
    };

    switch (card.type) {
        case CARD_TYPES.minion:
            baseState.stats = _pickStats(card._base.stats, ['cost', 'attack',
            // 'health'
        ]);
        break;
        case CARD_TYPES.hero:
            baseState.stats = _pickStats(card._base.stats, ['cost', 'attack',
            // 'health', 'armor'
        ]);
        break;
        case CARD_TYPES.weapon:
            baseState.stats = _pickStats(card._base.stats, ['cost', 'attack',
            // 'durability'
        ]);
        break;
        case CARD_TYPES.spell:
            baseState.stats = _pickStats(card._base.stats, ['cost']);
        break;
        case CARD_TYPES.enchantment:
            throw `Trying to buff the enchantment! ${card}`;
        case CARD_TYPES.power:
        case CARD_TYPES.game:
        case CARD_TYPES.player:
        default:
            throw `NOT_IMPLEMENTED: buffing of ${card}`;
    }

    const env = {
        self: card,
        host: card, // this is needed for mind control
        $: {}
    };

    // the expensive ".lastIndexOf" with 0 as default
    let ignoreOlder = allBuffs.reduce((a, v, i) => {
        let hasSilence = false;
        if (Array.isArray(v)) {
            hasSilence = v.includes(TAGS.silence);
        } else {
            hasSilence = v.tags.has(TAGS.silence);
        }

        return hasSilence ? i : a;
    }, 0);

    let activeBuffs = allBuffs.slice(ignoreOlder);

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
            const mutator = buff[k];
            if (!mutator) return; // if mutator is 0, we also ignore it

            if (typeof mutator === 'function') {
                state.stats[k] = mutator(state.stats[k], env);
            } else if (typeof mutator === 'number') {
                state.stats[k] += mutator;
            }
        });
        buff.tags && buff.tags.forEach(t => state.tags.add(t));
        buff.tagsDelete && buff.tagsDelete.forEach(t => state.tags.delete(t));

        state.triggers = state.triggers.concat(buff.on);
        state.auras = state.auras.concat(buff.aura);
        state.deathrattles = state.deathrattles.concat(buff.death);

        return state;
    }, baseState);

    return newState;
}
