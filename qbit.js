// A simple qbit representation. Not scientifically accurate, I suppose...
const Complex = require('Complex');

class qbits {
    n;
    factors;
    
    static all(_n) {
        let out = qbit.both();
        while (_n > 1) {
            --_n;
            out = out.entangle(qbit.both());
        }
        return out;
    }
    
    constructor(_n, _factors) {
        this.n = _n;
        this.factors = _factors.map(v => Complex.from(v));
    }
    
    entangle(/*qbits*/ right) {
        const n2 = this.n + right.n;
        const size = Math.pow(2, n2);
        const factors2 = new Array(size);
        let i = 0;
        this.factors.forEach((l) => {
            right.factors.forEach((r) => {
                factors2[i] = l.clone().multiply(r);
                i++;
            });
        });
        return new qbits(n2, factors2);
    }
    
    applyClassicalFunction(n, fn) {
        // This function is a cheaty way to bypass some of the most complex parts of quantum computing. It also helps
        // making draft code easier, before making an actual quantum circuit.
    
        const n2 = this.n + n;
        const size = Math.pow(2, n2);
        const factors2 = new Array(size);
        for (let i=0; i<size; ++i) {
            factors2[i] = Complex.from(0);
        }
        
        this.factors.forEach((f, i) => {
            if (f.magnitude() > 0) {
                const j = fn(i);
                const i2 = i << n + j;
                factors2[i2] = f;
            }
        });
        return new qbits(n2, factors2);
    }
    
    toPrecision(n) {
        const factors = this.factors.map(f => f.toPrecision(n));
        return new qbits(this.n, factors);
    }
}

class qbit extends qbits {
    get zero() {
        return this.factors[0];
    };
    get one() {
        return this.factors[1];
    }
    
    constructor(/*Complex*/ alpha, /*Complex*/ beta) {
        super(1, [ Complex.from(alpha), Complex.from(beta) ]);
    }
    
    static both() {
        return new qbit(new Complex(1 / Math.sqrt(2), 0), new Complex(1 / Math.sqrt(2), 0));
    }
    
    static zero() {
        return new qbit(new Complex(1, 0), new Complex(0, 0));
    }
    
    static one() {
        return new qbit(new Complex(0, 0), new Complex(1, 0));
    }
}

module.exports = {
    qbit,
    qbits,
};
