//https://en.wikipedia.org/wiki/Controlled_NOT_gate
const qbit = require('./qbit').qbit;
const qbits = require('./qbit').qbits;

function cnot(/*qbit*/ control, /*qbit*/ target) {
    const CNOT = [
        [ 1, 0, 0, 0 ],
        [ 0, 1, 0, 0 ],
        [ 0, 0, 0, 1 ],
        [ 0, 0, 1, 0 ],
    ];
    
    const entangled = control.entangle(target);
    
    //Still draft
    //entangle
    const _alpha = control.zero.clone().multiply(target.zero);
    const _beta  = control.zero.clone().multiply(target.one);
    const _gamma = control.one.clone().multiply(target.zero);
    const _delta = control.one.clone().multiply(target.one);
    
    const f = entangled.factors;
    
    //apply matrix
    const alpha = f[0]*CNOT[0][0] + f[1]*CNOT[0][1] + f[2]*CNOT[0][2] + f[3]*CNOT[0][3];
    const beta  = f[0]*CNOT[1][0] + f[1]*CNOT[1][1] + f[2]*CNOT[1][2] + f[3]*CNOT[1][3];
    const gamma = f[0]*CNOT[2][0] + f[1]*CNOT[2][1] + f[2]*CNOT[2][2] + f[3]*CNOT[2][3];
    const delta = f[0]*CNOT[3][0] + f[1]*CNOT[3][1] + f[2]*CNOT[3][2] + f[3]*CNOT[3][3];
    
    return new qbits(2,
        [
            alpha,
            beta,
            gamma,
            delta
        ]
    );
}

module.exports = cnot;
