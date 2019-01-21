import assert = require('assert');
import { initGame } from './../classes/bootstrap';
import { GameOptions } from './../data/constants';

const state_definition_TAUNT_start = {
    game: { turn: 5 },
    p1: {
        active: true, mana: 5, manaCrystals: 7,
        minions: `2/10`
    },
    p2: { minions: `1/1, 1/1, 1/1, 5/1+TAUNT, 1/1, 1/1, 1/1` }
};

const state_definition_TAUNT_end = {
    p1: { minions: `1/5` },
    p2: { minions: `1/1, 1/1, 1/1, 1/1, 1/1, 1/1` }
};

/**
 * TODO: 20/01/2019 - takes 90ms to complete
 * TODO: verbose syntax, lots of inner knowledge
 * TODO: NOW STIL creates deck, draws hand, etc
 * TODO: no easy way to silence console output
 */
describe('TAUNT', function () {

    let game: ReturnType<typeof initGame>;

    before(function () {
        game = initGame(
            ['Alice', ['HERO_08']],
            ['Bob', ['HERO_01']],
            state_definition_TAUNT_start
        );
        game.start();
    });
    after(function () {
        game.end();
    });
    describe('Minion with TAUNT tag', function () {

        it('should be the only possible attack target, even in presense of other characters in PLAY', function () {
            const actions = game.viewAvailableOptions().actions;
            const isAttack = (v): v is GameOptions.Attack => v.type === 'ATTACK';
            const targets: GameOptions.Attack[] = actions.filter(isAttack);
            assert.equal(targets.length, 1);
            assert.equal(targets[0].targetList.length, 1);

            // TODO: need ref support for -> assert.equal(targets[0].targetList[0], '#id' );
        });

        it('should be the one killed by auto attack by e2e bot', function () {
            const ownMinions = (state: ReturnType<typeof game.viewState>) => state.entities.filter(v => v.type === 'MINION' && v.attack === 2 && v.zone === 'PLAY');
            const enemyMinions = (state) => state.entities.filter(v => v.type === 'MINION' && v.health === 1 && v.zone === 'PLAY');

            const s1 = game.viewState();
            assert.equal(ownMinions(s1).length, 1);
            assert.equal(enemyMinions(s1).length, 7);

            game.chooseOption();
            game.view(); // DEBUG

            const s2 = game.viewState();
            assert.equal(ownMinions(s2).length, 1);
            assert.equal(ownMinions(s2)[0].health, 5);
            assert.equal(enemyMinions(s2).length, 6);
        });
    });
});
