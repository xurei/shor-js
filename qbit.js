// A simple qbit representation. Not scientifically accurate, I suppose...
const Complex = require('Complex');

class qbit {
    zero = new Complex(1,0);
    one = new Complex(0,0);
    states = [];
    
    product(/*qbit*/ right) {
    
    }
    
    static zero() {
        const out = new qbit();
        out.zero = new Complex(1,0);
        out.one = new Complex(0,0);
        return out;
    }
    
    static one() {
        const out = new qbit();
        out.zero = new Complex(0,0);
        out.one = new Complex(1,0);
        return out;
    }
    
    static compose (/*Complex*/ alpha, /*Complex*/ beta) {
        const out = new qbit();
        out.zero = Complex.from(alpha);
        out.one = Complex.from(beta);
        return out;
    }
}

const QONE = qbit.one();
const QZERO = qbit.zero();

module.exports = qbit;
