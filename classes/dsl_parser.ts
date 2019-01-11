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

function assignDefined<T={}>(
    // target: object,
     ...sources: T[]): T {
    const target = {} as T;
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

// const CHARACTER_STATS_RE = /^(?<attack>\d+)\/(?<health>\d+)(:?\((?<healthMax>\d+)\))?(:?\/?(?<armor>\d+))?/;
const GENERIC_STATS_RE = /^(?<s1>\d+)\/(?<s2>\d+)(:?\((?<s2_max>\d+)\))?(:?\/?(?<s3>\d+))?/;

// const CHARACTER_LOCATOR_RE =/^(:?[\/\D()])?:(?<by_id>[_0-9A-Za-z]{1,})|"(?<by_name>[^"]{1,})"/;
const GENERIC_LOCATOR_RE =/^(:?[\/\D()])?:(?<by_id>[_0-9A-Za-z]{1,})|"(?<by_name>[^"]{1,})"/;

export function play_generic_parser (token: string) {
    const stats_raw = token.match(GENERIC_STATS_RE);
    const stats = stats_raw ? stats_raw.groups : {};

    const buffs = token.split('+').slice(1).map(v => ({
        vanilla_tag: v
    }));

    const locator_raw = token.match(GENERIC_LOCATOR_RE);
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
            s1: str2num(stats.s1),
            s2: str2num(stats.s2),
            s2_max: str2num(stats.s2_max),
            s3: str2num(stats.s3)
        },
        locator: {
            by_id: locator.by_id,
            by_name: locator.by_name
        },
        buffs: [].concat(buffs).filter(v => v.vanilla_tag).map(v => v.vanilla_tag)
    } as {
        stats: {[k in 's1'|'s2'|'s2_max'|'s3' ]: number|undefined},
        buffs: CanBeMutated['buffs'],
        locator: EntitySelector
    };

    return parsed;
}

export function play_minion_parser (minion: string): MinionConfig {
    const parsed = play_generic_parser(minion);
    return assignDefined({
        type: 'MINION' as 'MINION',
        by_id: parsed.locator.by_id,
        by_name: parsed.locator.by_name,
        attack: parsed.stats.s1,
        health: parsed.stats.s2,
        healthMax: parsed.stats.s2_max,
        tags: parsed.buffs.length ? parsed.buffs: undefined
    });
}

function play_hero_parser (hero: string): HeroConfig {
    const parsed = play_generic_parser(hero);
    return assignDefined({
        type: 'HERO' as 'HERO',
        by_id: parsed.locator.by_id,
        by_name: parsed.locator.by_name,
        attack: parsed.stats.s1,
        health: parsed.stats.s2,
        healthMax: parsed.stats.s2_max,
        armor: parsed.stats.s3,
        tags: parsed.buffs.length ? parsed.buffs: undefined
    });
}

function play_power_parser (power: string) {
    return {};
}
function play_weapon_parser (weapon: string) {
    const parsed = play_generic_parser(weapon);
    return assignDefined({
        type: 'WEAPON' as 'WEAPON',
        by_id: parsed.locator.by_id,
        by_name: parsed.locator.by_name,
        attack: parsed.stats.s1,
        durability: parsed.stats.s2,
        tags: parsed.buffs.length ? parsed.buffs: undefined
    });
}
function play_game_parser (game: string): GameConfig {
    const parsed = play_generic_parser(game);
    return assignDefined({
        type: 'GAME' as 'GAME',
        turn: parsed.stats.s1,
        turnMax: parsed.stats.s2,
        tags: parsed.buffs.length ? parsed.buffs: undefined
    });
}
function play_player_parser (player: string): PlayerConfig {
    const parsed = play_generic_parser(player);
    return assignDefined({
        type: 'PLAYER' as 'PLAYER',
        mana: parsed.stats.s1,
        manaCrystals: parsed.stats.s2,
        manaCrystalsMax: parsed.stats.s2_max,
        tags: parsed.buffs.length ? parsed.buffs: undefined
    });
}

function hand_parser (card: string) {
    // HAND| $4:"Fireball", $3:GVG_097.powered_up, 3/2:"Imp"+:OG_345e, $6(10):"Aviana"
    return {
        type: 'UNKNOWN_PLAYABLE', // LOL ..
        attack: null,
        health: null,
        healthMax: null,
        armor: null,
        tags: []
    };
}
/**
 * This parser does not try to guess the type
 * So its the weakest and the most generic parser
 * Its only assumption, is that tokens are Cards
 * (not Game, Player or Enchantment)
 * @param card_token
 */
function simple_parser (card_token: string) {
    const buffs = card_token.split('+').slice(1).map(v => ({
        vanilla_tag: v
    }));

    const locator_raw = card_token.match(GENERIC_LOCATOR_RE);
    const locator = locator_raw ? locator_raw.groups : {};

    // DECK| :"Fireball", :"Imp"+:OG_345e, :"Aviana"
    return {
        type: 'UNKNOWN_PLAYABLE', // LOL ..
        attack: null,
        health: null,
        healthMax: null,
        armor: null,
        tags: []
    };
}

// WHERE SHOULD WE VALIDATE ZONE .legnth ?
const parsers = {
    'PLAY.minion': (minions) => minions.map(play_minion_parser),
    'PLAY.hero': ([hero, power, weapon]) => {
        return [
            play_hero_parser(hero),
            play_power_parser(power), // TODO
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
    'HAND': (cards) => cards.map(hand_parser),
    'DECK': (cards) => cards.map(simple_parser),
    'GRAVE': (cards) => cards.map(simple_parser)
};

export function get_parser_for_zone (zone: string) {
    return parsers[zone] || null;
}

export function parse_row(zone: string, tokens: string[]) {
    return get_parser_for_zone(zone)(tokens);
}

/// IN THE INIT
// healthMax: parsed.stats.healthMax || parsed.stats.health,
