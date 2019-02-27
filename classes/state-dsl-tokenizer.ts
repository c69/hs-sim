import { PARSERS } from './state-dsl-parsers';

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

// https://github.com/Microsoft/TypeScript/issues/24197#issuecomment-389928513
export function parse_row <
    K extends keyof typeof PARSERS,
    T extends typeof PARSERS
>(zone: K, tokens: string[]): ReturnType<T[K]> {
    try {
        return PARSERS[zone](tokens);
    } catch (e) {
        console.log(`parse_row:: args: ${zone}`, tokens);
        throw e;
    }
}

// type LOL = Parameters<typeof get_parser_for_zone>[0];
// export function parse_row(zone: LOL, tokens: string[]) {
// type LOL = Parameters<typeof get_parser_for_zone>[0];
// type RET = ReturnType<typeof get_parser_for_zone>;

/// IN THE INIT
// healthMax: parsed.stats.healthMax || parsed.stats.health,
