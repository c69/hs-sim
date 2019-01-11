export function split_into_lines (txt: string): string[] {
    return txt.split(/\n|;/).map(v => v.trim()).filter(v => !!v);
}

export function tokenize (s: string) {
    try {
        const header = s.match(/^([[A-Z]{1,20}]|[[A-Z]{1,20}\.?[a-z]{1,20}])\s/).slice(1)[0];

        const tail = s.slice(header.length).trim();
        // const [, entities] = tail.match(
        //     /([\D\/+A-Z]){1,},?\s?/g
        // );
        const entities = tail.split(/,\s*/);

        return [header, ...entities];
    } catch (e) {
        return null;
    }
}

export function get_zone (header: string): string {
    return header.slice(1, -1);
}

interface CanBePlayed {
    cost?: number;
}
interface EntitySelector {
    by_id: string;
    by_name: string;
}
interface CanBeMutated {
    tags: string[];
    buffs?: any[];
    props?: any;
}
interface CanBeReferenced {
    ref?: string;
}

interface CharacterBase {
    attack: number;
    health: number;
    healthMax?: number;
}

interface SpellBase extends CanBePlayed, CanBeMutated, CanBeReferenced, Partial<EntitySelector> {
    type: 'SPELL';
}
interface QuestInPlay extends SpellBase {
    progress: number;
    progressMax: number;
}
interface EnchantmentConfig extends Partial<EntitySelector> {
    // yeah, i know - LETS DO VANILLA BUFF ! +2/+2 gives minon +2/+2
    // NO. (not until everything else here works, at least)
    type: 'ENCHANTMENT';
    vanilla_tag?: string;
}
interface GameConfig extends CanBeMutated, CanBeReferenced, Partial<EntitySelector> {
    type: 'GAME';
    turn: number;
    turnMax: number;
}
interface PlayerConfig extends CanBeMutated, CanBeReferenced, Partial<EntitySelector> {
    type: 'PLAYER';
    mana: number;
    manaCrystals: number;
    manaCrystalsMax: number; // with overloaded
}
interface MinionConfig extends CharacterBase, CanBePlayed, CanBeMutated, CanBeReferenced, Partial<EntitySelector> {
    type: 'MINION';
}
interface HeroConfig extends CharacterBase, CanBePlayed, CanBeMutated, CanBeReferenced, Partial<EntitySelector> {
    type: 'HERO';
    armor?: number;
}

function str2num (n: string | undefined) {
    return n ? Number(n) : undefined;
}

function assignDefined(
    // target: object,
     ...sources: object[]): object {
    const target = {};
    for (const source of sources) {
        for (const key of Object.keys(source)) {
            const val = source[key];
            if (val !== undefined) {
                target[key] = val;
            }
        }
    }
    return target;
}

const DEFAULT_MINION = {
    type: 'MINION' as 'MINION',
    attack: undefined,
    health: undefined,
    healthMax: undefined,
    tags: undefined
};
const CHARACTER_STATS_RE = /^(?<attack>\d+)\/(?<health>\d+)(:?\?(?<health_max>\d+))?(:?\/?(?<armor>\d+))?/;
const CHARACTER_LOCATOR_RE =/^(:?[\/\D()])?:(?<by_id>[_0-9A-Za-z]{1,})|"(?<by_name>[^"]{1,})"/;

export function play_minion_parser (minion: string): MinionConfig {
    // '2/44?53/5'.match(
    //     /^(?<attack>\d+)\/(?<health>\d+)(:?\?(?<health_max>\d+))?(:?\/?(?<armor>\d+))?$/
    // );

    //console.log(minion);
    // console.log(minion.match(char_re));

    const stats_raw = minion.match(CHARACTER_STATS_RE);
    const stats = stats_raw ? stats_raw.groups : {};

    const buffs = minion.split('+').slice(1).map(v => ({
        vanilla_tag: v
    }));

    const locator_raw = minion.match(CHARACTER_LOCATOR_RE);
    //console.log(locator_raw);
    const locator = locator_raw ? locator_raw.groups : {};
    //----------------------
    // in HS-SIM, only props are:
    //      race, isReady, attackedThisTurn,
    //   vanilla tags with args:
    //      overload(3)
    // 2/3(5):GVG_OK.isReady=TRUE+TAUNT+A+B+:XXX_01#omg
    // 2/3(100):"Hungry Goblin"#01.race(DRAGON)+TAUNT+:XXX_01(:ZZZ_022)
    // stats = 0/0(0)[/0]
    // locator = :[id | name]
    // ref = #[000 | a-z_A-Z0-9]
    // prop = .[[_a-zA-Z0-9]  (-A-Za-z0-9_)]   // !!! no locator
    // buff = +[vanilla_tag | locator] [(locator)]
    // vanilla_tag = _A-Z0-9    // CAPS_LOCK_WITH_UNDERSCORE_11
    // [stats] [locator] [ref] [prop]* [buff]*
    // [stats] [buff/vanilla_tag]*

    const parsed = {
        stats: {
            attack: str2num(stats.attack),
            health: str2num(stats.health),
            healthMax: str2num(stats.healthMax)
        },
        locator: {
            by_id: locator.by_id,
            by_name: locator.by_name
        },
        buffs: [].concat(buffs).filter(v => v.vanilla_tag).map(v => v.vanilla_tag)
    } as {
        stats: CharacterBase,
        buffs: CanBeMutated['buffs'],
        locator: EntitySelector
    };

    return assignDefined(DEFAULT_MINION,
        {
            by_id: parsed.locator.by_id,
            by_name: parsed.locator.by_name,
            attack: parsed.stats.attack,
            health: parsed.stats.health,
            healthMax: parsed.stats.healthMax || parsed.stats.health,
            tags: parsed.buffs.length ? parsed.buffs: undefined
        }
    ) as MinionConfig;
}

function play_hero_parser (hero: string): HeroConfig {
    return {
        type: 'HERO',
        attack: null,
        health: null,
        healthMax: null,
        armor: null,
        tags: []
    };
}
function play_power_parser (power: string) {
    return {};
}
function play_weapon_parser (weapon: string) {
    return {};
}
function play_game_parser (game: string) {
    return {};
}
function play_player_parser (player: string) {
    return {};
}

const parsers = {
    'PLAY.minion': (minions) => minions.map(play_minion_parser),
    'PLAY.hero': ([hero, power, weapon]) => {
        return [
            play_hero_parser(hero),
            play_power_parser(power),
            play_weapon_parser(weapon)
        ];
    },
    'PLAY.game': ([game, player_1, player_2]) => {
        return [
            play_game_parser(game),
            play_player_parser(player_1),
            play_player_parser(player_2)
        ];
    },
    'PLAY.secret': null,
    'PLAY.quest': null,
    'HAND': null,
    'DECK': null,
    'GRAVE': null
};

export function get_parser_for_zone (zone: string) {
    return parsers[zone] || null;
}

export function parse(zone: string, tokens: string[]) {
    return [];
}
