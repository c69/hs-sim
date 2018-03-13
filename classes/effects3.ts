import {
    CARD_TYPES,
    TAGS,
    // TAGS_LIST,
    // KnownEnvConstants,
    // KnownMechanics,

    Cards,
    // Types,
    // EVENTS,
    ZONES
} from '../data/constants';


// ----------------- line 15
type Tag = string[];
type _Fn_mechanics_Placeholder = (o: any) => any;
type _Fn_condition = (o: any) => boolean;
type _Fn_mutator<T> = (n: T, o: any) => T;

type StatsAsNumbers = {
    cost: number;
    attack?: number;
    health?: number;
    armor?: number;
    durability?: number;
};
type HealthMaxMixin = {
    healthMax: number; // ?
}
type AuraContainer = {
    target: string;
    buff?: string; // should this just be id ???
    tags?: string[];
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
/** Real cards can have auras and triggers defined inline */
type EffectDefinitionMixin = {
    aura: AuraContainer | AuraContainer[];
    on: TriggerContainer | TriggerContainer[];
    death: _Fn_mechanics_Placeholder | _Fn_mechanics_Placeholder[];
}
type BuffDefinition = StatsAsNumbers & {
    card_id: number; // one mandatory property to make sure type is non-weak
}
type BuffContainer = StatsAsNumbers & {
    card_id: number; // one mandatory property to make sure type is non-weak

    // stats are actually mutators here !
    tags?: string[];
    tagsDelete?: string[];
    aura?: AuraContainer[];
    death?: DeathContainer[];
    on?: TriggerContainer[];
}
let __TEST_ME: BuffContainer = {
    card_id: 11,
    cost: 2,
    // on: [42]
}
type AnyPossibleBuff = Tag | BuffContainer;
type CardState = {
    // consider union for (Hero, Minion, Weapon, Spell)
    // also - stats for Game or Player would be totally different !
    stats: StatsAsNumbers & HealthMaxMixin;

    tags: Set<string>;

    triggers: TriggerContainer[];
    auras: AuraContainer[];
    deathrattles: DeathContainer[];

    refresh: (a: any) => any;
}
type Card_2 = {
    _base: CardState;
    _current: CardState;
    _effects: {
        original: AnyPossibleBuff[];
        given: AnyPossibleBuff[];
        temporary: AnyPossibleBuff[];
        auraEffects: AnyPossibleBuff[];
    }

    readonly tags: Set<string>;
} & Readonly<StatsAsNumbers>;


// --- was line 80 (= 65 lines total)
type Buff = {
    cost: any;
    tags: Set<string>;
    tagsDelete?: Set<string>;

    attack?: any;
    health?: any;
    armor?: any;
    durability?: any;

    death?: any;
    aura?: any[];
    on?: any[];

    [K: string]: any;
}

type BuffOrTags = string[] | Buff;

function _pick (obj: {[k: string]: any}, props: string[]) {
    return props.reduce((a, v) => {
        a[v] = obj[v + 'Base'];
        return a;
    }, {} as {[K: string]: any});
};

export function applyEffects (card: Cards.Card): Buff  {
    let allBuffs = [].concat(card.buffs, card.incomingAuras);
    if (!allBuffs.length) return null;


    let baseStats = {
    } as {[K: string]: any};

    switch (card.type) {
        case CARD_TYPES.minion:
            baseStats = _pick(card, ['cost', 'attack',
            // 'health'
        ]);
        break;
        case CARD_TYPES.hero:
            baseStats = _pick(card, ['cost', 'attack',
            // 'health', 'armor'
        ]);
        break;
        case CARD_TYPES.weapon:
            baseStats = _pick(card, ['cost', 'attack',
            // 'durability'
        ]);
        break;
        case CARD_TYPES.spell:
            baseStats = _pick(card, ['cost']);
        break;
        case CARD_TYPES.enchantment:
            throw `Trying to buff the enchantment! ${card}`;
        case CARD_TYPES.power:
        case CARD_TYPES.game:
        case CARD_TYPES.player:
        default:
            throw `NOT_IMPLEMENTED: buffing of ${card}`;
    }
    baseStats.tags = new Set()

    const env = {
        self: card,
        host: card, // this is needed for mind control
        $: {}
    };

    // this will work as long as there are no composite buffs with silence
    let ignoreOlder = allBuffs.lastIndexOf(TAGS.silence);
    // this is robust - but expensive...
    // let ignoreOlder_2 = allBuffs.reduce((a, v, i) => (
    //     (v === TAGS.silence || v.effects.tags.has(TAGS.silence)) ? i : a
    // ), -1);

    if (ignoreOlder === -1) ignoreOlder = 0;
    let activeBuffs = allBuffs.slice(ignoreOlder);

    const newStats = (activeBuffs as BuffOrTags[]).reduce((stats, buff) => {
        if (typeof buff === 'string') {
            stats.tags.add(buff);
            return stats;
        }
        if (Array.isArray(buff)) {
            buff.forEach(t => stats.tags.add(t));
            return stats;
        }
//        if (buffCard.zone !== ZONES.play) throw `Zombie enchantment ${buff}`;

        [
            'cost',
            'attack',
            // --- TODO: damage-related stats are not ready for prime-time
            // 'health',
            // 'armor',
            // 'durability'
        ].forEach(k => {
            const mutator = buff[k];
            if (!mutator) return; // if mutator is 0, we also ignore it
            // if (!stats[k]) throw `(* will fail for .on or .deathrattle) Attempt to add unexpected stat ${k} into ${card}`;
            /* HACK */ //if (!stats[k]) stats[k] = stats[k + 'Base'];
            if (typeof mutator === 'function') {
                stats[k] = mutator(stats[k], env);
            } else if (typeof mutator === 'number') {
                stats[k] += mutator;
            }
        });
        buff.tags && stats.tags.add(buff.tags);
        buff.tagsDelete && buff.tagsDelete.forEach(t => buff.delete(t));

        [
            'on',
            'aura',
            'deathrattle'
        ].forEach(k => {
            const behavior = buff[k];
            if (!behavior) return;
            if (!Array.isArray(behavior)) throw `.${k} should be an array in ${buff}`;

            // TODO: how to make {host} work ???
            if (!stats[k]) {
                stats[k] = [];
            }
            stats[k] = stats[k].concat(behavior);
        })

        return stats;
    }, baseStats);

    return newStats;
}
