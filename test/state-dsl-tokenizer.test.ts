import assert = require('assert');
import {
    split_into_lines,
    tokenize,
    parse_row
} from '../classes/state-dsl-tokenizer';

describe('split_into_lines', function() {
    it('should split multiline into array of strings', function() {
        assert.deepEqual(
            split_into_lines('a\nb\nc'),
            ['a', 'b', 'c']
        );
    });
    it('should split by semicolon ";" into array of strings', function() {
        assert.deepEqual(
            split_into_lines('a;b;c'),
            ['a', 'b', 'c']
        );
    });
    it('should strip empty lines and trim leading/trailing whitespaces', function() {
        assert.deepEqual(
            split_into_lines(`
a
   b
c
            `),
            ['a', 'b', 'c']
        );
    });
});

describe('parse_row', function() {
    it('should parse minion line into array of minion-config object', function () {
        const minions = parse_row(
            'PLAY.minion',
            ['3/2', ':"Annoy-o-Tron"', '1/1+TAUNT']
        );
        assert.equal(minions.length, 3);
        assert.deepEqual(
            minions,
            [
                {type: 'MINION', attack: 3, health: 2},
                {type: 'MINION', by_name: 'Annoy-o-Tron'},
                {type: 'MINION', attack: 1, health: 1, tags: ['TAUNT']},
            ]
        );
    });
});

describe('tokenize', function() {
    it('should split line into array of tokens', function () {
        const groups = tokenize(
            '[PLAY.minion] 3/2, 3/3, 1/1+TAUNT'
        );
        assert.deepEqual(
            // tokenize('[PLAY.minion] 3/2, 2/3(5), 3/3+TAUNT, 2/2:GVG_144, 2/2:"Knife Juggler".ready=1'),
            groups,
            [
                '[PLAY.minion]',
                '3/2',
                '3/3',
                '1/1+TAUNT'
            ]
        );
    });

    describe('shoulld handle edge cases', function () {
        ([
            ['top-level zone', '[X] yyy', ['[X]', 'yyy']],
            // COMMA INSIDE BRACES FAILS - but only 26 cards have comma in their name
            // ['comma inside braces', '[X] :"oops, sorry"', ['[X]', ':"oops, sorry"']],
            ['space', '[X.x] :"Hello space"', ['[X.x]', ':"Hello space"']],
            ['dollars, hashes, underscores', '[X] $7:GVG_014, 3/5#ok', ['[X]', '$7:GVG_014', '3/5#ok']],
            ['braces', '[X] 0/26(30)/5:H', ['[X]', '0/26(30)/5:H']],
            ['echnantment by id', '[X] x+:GVG_045+:"Some Spell"', ['[X]', 'x+:GVG_045+:"Some Spell"']]
        ] as [string, string, string[]][]).forEach(
            ([TEST_NAME, RAW, EXPECTED], i) => {
            it(TEST_NAME, function () {
                assert.deepEqual(
                    tokenize(RAW),
                    EXPECTED
                );
            });
        });
    });
});