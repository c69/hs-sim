import { get_parser_for_zone } from './state-dsl-parsers';

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
export function tail_split (tail: string) {
    return tail.split(/,\s*/);
}

export function get_zone (header: string): string {
    return header.slice(1, -1);
}

type LOL = Parameters<typeof get_parser_for_zone>[0];
export function parse_row(zone: LOL, tokens: string[]) {
    try {
        return get_parser_for_zone(zone)(tokens);
    } catch (e) {
        console.log(`parse_row:: args: ${zone}`, tokens);
        throw e;
    }
}

/// IN THE INIT
// healthMax: parsed.stats.healthMax || parsed.stats.health,
