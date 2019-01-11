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
    by_id: number;
    by_name: string;
}
interface CanBeMutated {
    buffs?: any;
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

function play_minion_parser (minion: string): MinionConfig {
    '2/44?53/5'.match(
        /^(?<attack>\d+)\/(?<health>\d+)(:?\?(?<health_max>\d+))?(:?\/?(?<armor>\d+))?$/
    );

    const char_re = /^(?<attack>\d+)\/(?<health>\d+)(:?\?(?<health_max>\d+))?(:?\/?(?<armor>\d+))?$/;

    const stats = minion.match(char_re).groups;

    return {
        type: 'MINION',
        attack: 2,
        health: 3,
        healthMax: 5
    };
}
function play_hero_parser (hero: string): HeroConfig {
    return {
        type: 'HERO',
        attack: 1,
        health: 2,
        healthMax: 2,
        armor: 0
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
