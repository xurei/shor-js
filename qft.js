const qbit = require('./qbit').qbit;
const qbits = require('./qbit').qbits;
const Complex = require('Complex');

module.exports = function qft(/*qbits*/ input, n) {
    const N = Math.pow(2, n);
    const w = Complex.from(0, Math.sin(Math.PI*2/N));
    
    const matrix = [];
    for (let row=0; row<N; ++row) {
        matrix[row] = [];
        for (let col=0; col<N; ++col) {
            matrix[row][col] = w.pow(row*col);
        }
    }
    
    
}
