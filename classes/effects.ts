type Trigger = 'deathrattle'
| 'play'
| 'on';

type KnownTag = 'DIVINE_SHIELD' | 'TAUNT';

type KnownStat =
'attack' |
'health' |
'healthFull' |
'durability' |
'armor' |
'cost' |
'owner';

type UnionKeyToValue<U extends string, T> = {
    [K in U]: T;
}
type MapString<T> = {
    [index: string]: T;
}
type U2<K extends string, T> = UnionKeyToValue<K, T> & MapString<T>;

type Stats = U2<KnownStat, number>;

type Tag = KnownTag;

type Buff = {
    name: string;
    tagsAdd?: Set<Tag>;
    tagsDelete?: Set<Tag>;
    stats?: U2<KnownStat, ((a: number) => number) | number>;

    expires? (a: number): boolean; // no no no....
    type: 'aura' | 'temporary' | 'permanent'; // not again :(

    // triggers?
};

// type HSEvent = 'WAS_DAMAGED' | 'WAS_HEALED'

export type EffectTarget = {
    // zone: Set<string>; // ?
    buffs: {
        incomingAuras: Buff[]; // refreshing each tick
        temporary: Buff[]; // mutable
        history: Buff[]; // all, !append-only
        active: Buff[]; // calculated current state
    }
    tags: Set<Tag>; // fast query
//    events: HSEvent[];
    stats: Partial<Stats>;
    statsBase: Partial<Stats>;
    // triggers: Partial<UnionKeyToValue<Trigger, Function[]>>;  // :(((
}

export function effectReducer (a: EffectTarget, fx: Buff): EffectTarget {
    // todo: only apply buff if target zone matches buff zone(s)
    a.buffs.history.push(fx);

    // this if looks sad .. - also, regenerating whole history each time o_O
    if (fx.type === 'aura') {
        a.buffs.incomingAuras.push(fx);
    } else if (fx.type === 'temporary') {
        a.buffs.temporary.push(fx);
    } else if (fx.type === 'permanent') {
        a.buffs.active.push(fx);
    }

    if (fx.stats) {
        Object.keys(fx.stats).forEach(k => {
            let newVal = fx.stats[k];
            if (typeof newVal === 'number') {
                a.stats[k] += newVal;
            } else {
                a.stats[k] = newVal(a.stats[k]);
            }
            // todo: add flooring by 0
            // todo: .Player/.owner is too dangerous to be here
        });
    }
    if (fx.tagsAdd) {
        fx.tagsAdd.forEach(v => a.tags.add(v));
    }
    if (fx.tagsDelete) {
        fx.tagsAdd.forEach(v => a.tags.delete(v));
    }

    return a;
};

// whatever
type AuditableCard = {
    audit: {
        createdBy: string;
        createdTurn: number;
        diedTurn: number;
    }
}

let baseCard: EffectTarget = {
    statsBase: {
        health: 5,
        healthFull: 5,
        attack: 3,
        cost: 4,
        owner: 1
    },
    stats: {
        health: 5,
        healthFull: 5,
        attack: 3,
        cost: 4,
        owner: 1
    },
    tags: new Set(),
    // triggers: [],
    buffs: {
        incomingAuras: [],
        temporary: [],
        history: [],
        active: []
    }
};

/**
this is interpreted as :(

const tags: {
    DIVINE_SHIELD: "DIVINE_SHIELD" | "TAUNT";
    TAUNT: "DIVINE_SHIELD" | "TAUNT";
}
*/
const tags: {[key in KnownTag]: KnownTag} = {
    'TAUNT': 'TAUNT',
    'DIVINE_SHIELD': 'DIVINE_SHIELD'
};
let effectList = ([
    {
        name: 'Divine Blessing',
        stats: {
            health: 3,
            attack: 42
        },
        tagsAdd: new Set([tags.TAUNT])
    },
    {
        name: 'dmg',
        stats: {
            health: -2
        },
        tagsRemove: new Set(['DIVINE_SHIELD'])
    }
] as Buff[]);

console.log(effectList);
console.log(baseCard);
// process.exit();

// version: number;
// b.version += 1; // should not we only update the target when it changed ?

// let result = effectList.reduce<EffectTarget>(reducer, baseCard);
// console.log(result);
