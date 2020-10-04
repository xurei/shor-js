const mocha = require('mocha');
var assert = require('assert');
const qbit = require('../qbit').qbit;
const qbits = require('../qbit').qbits;

const ONE_SQRT2 = 1.0/Math.sqrt(2);
const ONE_SQRT4 = 1.0/Math.sqrt(4);

describe('Qbits', () => {
    describe('entangle', () => {
        it('entangle(❙0❭, ❙0❭) = ❙00❭', () => {
            assert.deepEqual(qbit.zero().entangle(qbit.zero()), new qbits(2, [1, 0, 0, 0]));
        });
        it('entangle(❙0❭, ❙1❭) = ❙01❭', () => {
            assert.deepEqual(qbit.zero().entangle(qbit.one()), new qbits(2, [0, 1, 0, 0]));
        });
        it('entangle(❙1❭, ❙0❭) = ❙10❭', () => {
            assert.deepEqual(qbit.one().entangle(qbit.zero()), new qbits(2, [0, 0, 1, 0]));
        });
        it('entangle(❙1❭, ❙1❭) = ❙11❭', () => {
            assert.deepEqual(qbit.one().entangle(qbit.one()), new qbits(2, [0, 0, 0, 1]));
        });
        it('entangle(❙10❭, ❙1❭) = ❙101❭', () => {
            assert.deepEqual(new qbits(2, [0, 0, 1, 0]).entangle(qbit.one()), new qbits(3, [0, 0, 0, 0, 0, 1, 0, 0]));
        });
        it('entangle(1/√2 ❙0❭ + 1/√2 ❙1❭, ❙0❭) = 1/√2 ❙00❭ + 1/√2 ❙10❭', () => {
            assert.deepEqual(
                qbit.both().entangle(qbit.zero()),
                new qbits(2, [ONE_SQRT2, 0, ONE_SQRT2, 0])
            );
        });
        it('entangle(❙1❭, 1/√2 ❙0❭ + 1/√2 ❙1❭) = 1/√2 ❙10❭ + 1/√2 ❙11❭', () => {
            assert.deepEqual(
                qbit.one().entangle(qbit.both()),
                new qbits(2, [0, 0, ONE_SQRT2, ONE_SQRT2])
            );
        });
        it('entangle(1/√2 ❙0❭ + 1/√2 ❙1❭, 1/√2 ❙0❭ + 1/√2 ❙1❭) = 1/√4 ❙00❭ + 1/√4 ❙01❭ + 1/√4 ❙10❭ + 1/√4 ❙11❭', () => {
            const out = qbit.both().entangle(qbit.both());
            const factors = out.factors.map(f => f.toPrecision(5));
            assert.deepEqual(
                factors,
                new qbits(2, [ONE_SQRT4, ONE_SQRT4, ONE_SQRT4, ONE_SQRT4]).factors.map(f => f.toPrecision(5))
            );
        });
    });
});
