const mocha = require('mocha');
var assert = require('assert');
const hadamart1 = require('../hadamart').hadamart1;
const qbit = require('../qbit').qbit;
const Complex = require('Complex');

describe('Quantum gates', () => {
    describe('Hadamart H1', () => {
        it('H1(❙0❭) = 1/√2 ❙0❭ + 1/√2 ❙1❭', () => {
            const out = hadamart1(qbit.zero());
            assert.deepEqual(out.zero, new Complex(1/Math.sqrt(2),0));
            assert.deepEqual(out.one, new Complex(1/Math.sqrt(2),0));
        });
        it('H1(❙1❭) = 1/√2 ❙0❭ + 1/√2 ❙1❭', () => {
            const out = hadamart1(qbit.one());
            assert.deepEqual(out.zero, new Complex(1/Math.sqrt(2),0));
            assert.deepEqual(out.one, new Complex(-1/Math.sqrt(2),0));
        });
        it('H1(H1(❙0❭)) = ❙0❭', () => {
            const out = hadamart1(hadamart1(qbit.zero()));
            assert.deepEqual(out.zero.toPrecision(5), Complex.from(1).toPrecision(5));
            assert.deepEqual(out.one.toPrecision(5), Complex.from(0).toPrecision(5));
        });
        it('H1(H1(❙1❭)) = ❙1❭', () => {
            const out = hadamart1(hadamart1(qbit.one()));
            assert.deepEqual(out.zero.toPrecision(5), Complex.from(0).toPrecision(5));
            assert.deepEqual(out.one.toPrecision(5), Complex.from(1).toPrecision(5));
        });
    });
});
