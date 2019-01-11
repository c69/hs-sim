import assert = require('assert');
import {
    split_into_lines,
    tokenize
} from '../classes/dsl_parser';

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
            ['space', '[X.x] :"Hello space"', ['[X.x]', ':"Hello space"']]
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
