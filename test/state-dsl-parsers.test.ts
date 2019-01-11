import assert = require('assert');
import {
    play_minion_parser
} from '../classes/state-dsl-parsers';

describe('play_minion_parser', function() {
    it('should parse a simple minion', function () {
        const minionConfig = play_minion_parser(
            '1/2+TAUNT'
        );
        assert.deepEqual(
            minionConfig,
            {
                type: 'MINION',
                attack: 1,
                health: 2,
                tags: ['TAUNT']
            }
        );
    });
    it('should parse a simple minion with max health', function () {
        const minionConfig = play_minion_parser(
            '1/2(5)+TAUNT'
        );
        assert.deepEqual(
            minionConfig,
            {
                type: 'MINION',
                attack: 1,
                health: 2,
                healthMax: 5,
                tags: ['TAUNT']
            }
        );
    });
    it('should parse multiple buffs', function () {
        const minionConfig = play_minion_parser(
            '1/2+CHARGE+DIVINE_SHIELD'
        );
        assert.deepEqual(
            minionConfig,
            {
                type: 'MINION',
                attack: 1,
                health: 2,
                tags: ['CHARGE', 'DIVINE_SHIELD']
            }
        );
    });
    it('should parse minion by locator :id', function () {
        const minionConfig = play_minion_parser(
            ':CS2_125' // Ironfur Grizzly
        );
        assert.deepEqual(
            minionConfig,
            {
                type: 'MINION',
                by_id: 'CS2_125'
            }
        );
    });

    it('should parse minion by locator :"name"', function () {
        const minionConfig = play_minion_parser(
            ':"Ironfur Grizzly"'
        );
        assert.deepEqual(
            minionConfig,
            {
                type: 'MINION',
                by_name: 'Ironfur Grizzly'
            }
        );
    });

    it('should return empty object +type, for unparseable token', function () {
        const minionConfig = play_minion_parser(
            'abc waa'
        );
        assert.deepEqual(
            minionConfig,
            {
                type: 'MINION'
            }
        );
    });
});
