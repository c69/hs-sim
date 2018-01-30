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

// type S2 = MapString<number> & UnionKeyToValue<KnownStat, number>;
type S2 = U2<KnownStat, number>;

type Stats = UnionKeyToValue<KnownStat, number>;
type Tag = KnownTag;

type Buff = {
    name: string;
    tagsAdd?: Set<Tag>;
    tagsDelete?: Set<Tag>;
    expires? (a: number): boolean; // no no no....
    stats?: U2<KnownStat, ((a: number) => number) | number>;
};

type EffectTarget = {
    buffs: {
        incomingAuras: Buff[]; // refreshing each tick
        temporary: Buff[]; // mutable
        history: Buff[]; // append-only
        active: Buff[]; // calculated current state
    }
    tags: Set<Tag>; // fast query
    // stats: Partial<Stats>;
    stats: Partial<S2>;
    statsBase: Partial<Stats>;
    // triggers: Partial<UnionKeyToValue<Trigger, Function[]>>;  // :(((
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

const tags: {[key in KnownTag]: KnownTag} = {
    'TAUNT': 'TAUNT',
    'DIVINE_SHIELD': 'DIVINE_SHIELD'
};
let src = ([
    {
        name: 'Divine Blessing',
        stats: {
            health: 3,
            attack: 42
        },
        tagsAdd: new Set([tags.TAUNT])
    }
] as Buff[]);

console.log(src);
console.log(baseCard);
// process.exit();

let xxx = src.reduce<EffectTarget>((a, fx) => {
    if (fx.stats) {
        Object.keys(fx.stats).forEach(k => {

            let newVal = fx.stats[k];
            if (typeof newVal === 'number') {
                a.stats[k] += newVal;
            } else {
                a.stats[k] = newVal(a.stats[k]);
            }
            console.log(a.stats, k, newVal);
        });
    }
    if (fx.tagsAdd) {
        fx.tagsAdd.forEach(v => a.tags.add(v));
    }
    if (fx.tagsDelete) {
        fx.tagsAdd.forEach(v => a.tags.delete(v));
    }
    a.buffs.active.push(fx);

    return a;
}, baseCard);


// whatever
type AuditableCard = {
    audit: {
        createdBy: string;
        createdTurn: number;
        diedTurn: number;
    }
}

console.log(xxx);