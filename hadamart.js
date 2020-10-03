//https://en.wikipedia.org/wiki/Controlled_NOT_gate

const qbit = require('./qbit');

const ONE_SQRT2 = 1.0/Math.sqrt(2);

function hadamart1(/*qbit*/ input) {
    //H1 = [ 1  1 ]
    //     [ 1 -1 ]
    const alpha = input.zero.clone().add(input.one);
    const beta = input.zero.clone().add(input.one.clone().negate());
    return qbit.compose(ONE_SQRT2*alpha, ONE_SQRT2*beta);
}

module.exports = {
    hadamart1
};
