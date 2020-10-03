// A simple qbit representation. Not scientifically accurate, I suppose...
const Complex = require('Complex');

class qbit {
    v1 = new Complex(1,0);
    v2 = new Complex(0,0);
    states = [];
}

qbit.zero = () => {
    const out = new qbit();
    out.v1 = new Complex(1,0);
    out.v2 = new Complex(0,0);
    return out;
}

qbit.one = () => {
    const out = new qbit();
    out.v1 = new Complex(0,0);
    out.v2 = new Complex(1,0);
    return out;
}

const QONE = qbit.one();
const QZERO = qbit.one();

qbit.compose = (/*Complex*/ alpha, /*Complex*/ beta) => {
    const out = new qbit();
    out.v1 = alpha;
    out.v2 = beta;
}
