const mocha = require('mocha');
var assert = require('assert');
const cnot = require('../cnot');
const qbit = require('../qbit').qbit;
const qbits = require('../qbit').qbits;

const ONE_SQRT2 = 1.0/Math.sqrt(2);

describe('Quantum gates', () => {
    describe('CNOT', () => {
        it('CNOT(❙0❭, ❙0❭) = (❙00❭)', () => {
            const out = cnot(qbit.zero(), qbit.zero());
            assert.deepEqual(out, new qbits(2, [1, 0, 0, 0]));
        });
        it('CNOT(❙0❭, ❙1❭) = (❙01❭)', () => {
            const out = cnot(qbit.zero(), qbit.one());
            assert.deepEqual(out, new qbits(2, [0, 1, 0, 0]));
        });
        it('CNOT(❙1❭, ❙0❭) = (❙11❭)', () => {
            const out = cnot(qbit.one(), qbit.zero());
            assert.deepEqual(out, new qbits(2, [0, 0, 0, 1]));
        });
        it('CNOT(❙1❭, ❙1❭) = (❙10❭)', () => {
            const out = cnot(qbit.one(), qbit.one());
            assert.deepEqual(out, new qbits(2, [0, 0, 1, 0]));
        });
        it('BELL STATE', () => {
            const out = cnot(qbit.both(), qbit.zero());
            assert.deepEqual(out, new qbits(2, [ONE_SQRT2, 0, 0, ONE_SQRT2]));
        });
    });
});
