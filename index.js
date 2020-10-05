const gcd = require('gcd');
const ft = require('fourier-transform');
//const fft = require('fft-js').fft;
//const fftUtil = require('fft-js').util;
var gnuplot = require('gnu-plot');
const myidft = require('./myidft');
const qbit = require('./qbit').qbit;
const qbits = require('./qbit').qbits;
const qft = require('./qft');

var fourier = require('fourier');
const fft = (data) => {
    return fourier.dft(data, data.map(() => 0));
}
const ifft = (freq) => {
    return fourier.idft(freq[0], freq[1]);
}
const myifft = (freq) => {
    return myidft(freq[0], freq[1]);
}

function fftMag(vals) {
    return vals[0].map((v,i) => {
        const a = vals[0][i]*vals[0][i];
        const b = vals[1][i]*vals[1][i];
        return Math.sqrt(a+b);
    });
}

const tofactor = 21; // 3 * 7, in case you forgot

function doFactor(N) {
    console.log("N:", N);
    //1. Pick a random number 1 < a < N
    const a = 11;//Math.floor(Math.random() * (N-2)) + 2;
    console.log("a:", a);
    
    //2. Compute gcd(a, N)
    const gcd_a_n = gcd(a, N);
    console.log("gcd(a, N):", gcd_a_n);
    
    //3. If gcd ( a , N ) ≠ 1, then this number is a nontrivial factor of N, so we are done.
    if (gcd_a_n !== 1) {
        console.log("Found a (possibly non-prime) factor:", gcd_a_n);
        console.log("Factor2:", N/gcd_a_n);
        return;
    }
    
    //4. Otherwise, use the quantum period-finding subroutine (below) to find r, which denotes the period of the following function:
    //   f(x) = a^x mod N
    const r = quantum_part(N, a);
    
    console.log("r found:", r);
    
    //5. If r is odd, then go back to step 1.
    if (r % 2 === 1) {
        console.log("r is odd; restart");
        return doFactor(N);
    }
    
    //6. If a^(r/2)+1 ≡ 0 ( mod N ), i.e if (a^(r/2)+1) % N == 0), then go back to step 1.
    const a_exp_plus_1 = Math.pow(a, r/2) + 1;
    const a_exp_minus_1 = Math.pow(a, r/2) - 1;
    if (a_exp_plus_1 % N === 0) {
        console.log("a^(r/2)+1 ≡ 0 ( mod N ); restart");
        return doFactor(N);
    }
    
    //7.Otherwise, both gcd(a^(r/2) + 1, N) and gcd(a^(r/2) - 1, N) are nontrivial factors of N, so we are done.
    const factor1 = gcd(a_exp_plus_1, N);
    const factor2 = gcd(a_exp_minus_1, N);
    
    console.log("Factor1:", factor1);
    console.log("Factor2:", factor2);
    console.log("Product:", factor1*factor2, factor1*factor2 === N ? " OK" : "Something's wrong");
}

function quantum_part(N, a) {
    const NN = N*N;
    //Given N, find Q=2q such that N^2 ≤ Q < 2N^2, which implies that Q/r > N
    let Q = 2;
    let q = 1;
    let n = Math.ceil(Math.log2(N));
    while (Q < NN) {
        Q *= 2;
        q++;
    }
    console.log("N:", N, "<= 2 ^", n);
    console.log("Q:", Q, "= 2 ^", q);
    
    // Initialize a fully entangled set of q bits. This represents the initial states with all the exponents given to f(x) = a^x mod N
    // Notice: The emulation on a classical computer takes a O(2^q) time and space algorithm. It will *NOT* be efficient. At all !
    //         On an actual quantum computer, it takes a O(q) time and space computation - provided you can make a clever measurement.
    const input = qbits.all(q);
    
    //Quantum function : some pointers
    //https://towardsdatascience.com/qantum-parallelism-where-quantum-computers-get-their-mojo-from-66c93bd09855
    //https://arxiv.org/pdf/1202.6614.pdf
    
    //Quantum modular exponentiation is still a researched field. For now, let's just do it more classically, even if it's probably not valid
    const output = input.applyClassicalFunction(n, function modexp(x) {
        let out = 1;
        for (let i=0; i<x; ++i) {
            out = (out * a) % N;
        }
        return out;
    });
    /*input.factors.forEach((f, i) => {
        if (f.magnitude() > 0) {
            const j = fn(i);
            const i2 = i << n + j;
        }
    })*/
    
    qft(output, input.n);
    
    console.log(output);
    
    return 14;
}

function quantum_part_fullclassical(N, a) {
    //Draft version, just to make sure I understood it well
    let acc = a;
    let vals = [];
    
    const NN = N*N;
    //Given N, find Q=2q such that N^2 ≤ Q < 2N^2, which implies that Q/r > N
    let Q = 2;
    let q = 1;
    while (Q < NN) {
        Q *= 2;
        q++;
    }
    console.log("Q:", Q, "= 2^", q)
    
    for (let i=0; i<Q; ++i) {
        vals.push(acc);
        acc *= a;
        acc %= N;
    }
    
    /*while (Math.log2(vals.length) !== Math.floor(Math.log2(vals.length))) {
        vals.push(acc);
        acc *= a;
        acc %= N;
    }
    
    for (let i=0; i< 0; ++i) {
        vals.push(acc);
        acc *= a;
        acc %= N;
        while (Math.log2(vals.length) !== Math.floor(Math.log2(vals.length))) {
            vals.push(acc);
            acc *= a;
            acc %= N;
        }
    }*/
    
    //Averaging vals to zero
    //const avg = vals.reduce((a,b) => a+b, 0) / vals.length;
    //vals = vals.map(v => v - avg);
    
    /*vals = [
        17, 16, -1, -16, 17, 16, -1, -16,
        17, 16, -1, -16, 17, 16, -1, -16,
        17, 16, -1, -16, 17, 16, -1, -16,
        17, 16, -1, -16, 17, 16, -1, -16,
        17, 16, -1, -16, 17, 16, -1, -16,
        17, 16, -1, -16, 17, 16, -1, -16,
        17, 16, -1, -16, 17, 16, -1, -16,
        17, 16, -1, -16, 17, 16, -1, -16,
    ];*/
    //vals = [
    //    17, 12, -10, -17, -17, -10, 12, 17,
    //    17, 12, -10, -17, -17, -10, 12, 17,
    //    17, 12, -10, -17, -17, -10, 12, 17,
    //    17, 12, -10, -17, -17, -10, 12, 17,
    //    17, 12, -10, -17, -17, -10, 12, 17,
    //    17, 12, -10, -17, -17, -10, 12, 17,
    //    17, 12, -10, -17, -17, -10, 12, 17,
    //    17, 12, -10, -17, -17, -10, 12, 17,
    //];
    
    //const F = 7;
    //vals = [];
    //for (let i = 0; i < 32; ++i) {
    //    const x = Math.cos(Math.PI*2 / F * i);
    //    vals[i] = Math.random()-0.5+x;// 2*x;
    //}
    
    console.log(vals.map(v => Math.round(v*100)/100));
    console.log(vals[vals.length-1]);
    const freq = fft(vals);
    //freq[0][0] = 0;
    //freq[1][0] = 0;
    /*freq[0][freq[0].length/2] = 0;
    freq[1][freq[1].length/2] = 0;*/
    
    let freq2 = freq.slice().map(i => i.slice());
    //freq2[0] = freq2[0].map((v,i) => i > freq[0].length/2 ? 0 : v);
    //freq2[1] = freq2[1].map((v,i) => i > freq[0].length/2 ? 0 : v);
    
    const valsBack = ifft(freq2)[0];
    
    const freqMag = fftMag(freq2);
    console.log('freqMag');
    console.log(freqMag.map((v,i) => {
        let line = '';
        //f/=10;
        let a = v;
        while (a>10) {
            line += '=';
            a -= 10;
        }
        
        let f = i;
        
        let vstr = `${v<10 ? ' ':''}${v<100 ? ' ':''}${Math.round(v)}`;
        return `${Math.abs(f)<10?' ':''}${f}: ${vstr} ${line}  ${v > 10 ? freqMag.length/f : ''}`;
    }).join('\n'));
    //console.log(ft(vals));
    console.log(valsBack.map(v => Math.round(v*100)/100));
    
    const L = freqMag.length/2/Math.PI;
    const plot_data = freqMag.map((v,i) => [i/freqMag.length-0.5, (v)]);
    const plot2_data = valsBack.map((v,i) => [i/freqMag.length-0.5, (v)]);
    const plot3_data = vals.map((v,i) => [i/freqMag.length-0.5, (v)]);
    
    const plot2 = gnuplot()
    plot2.set({
        term:"png size 800,600", output: '"plotval.png"',
        xrange:'[-0.6:0.6]',
        //xtics: `${-Math.round(L)},1,${Math.round(L)}`
    })
    plot2.plot([{
        data: plot2_data,
        style: 'impulse'
    }])
    
    const plot3 = gnuplot()
    plot3.set({
        term:"png size 800,600", output: '"plotvalorig.png"',
        xrange:'[-0.6:0.6]',
        //xtics: `${-Math.round(L)},1,${Math.round(L)}`
    })
    plot3.plot([{
        data: plot3_data,
        style: 'impulse'
    }])
    
    const plot = gnuplot()
    plot.set({
        term:"png size 800,600", output: '"plot.png"',
        xrange:'[-0.6:0.6]',
        //xtics: `${-Math.round(L)},1,${Math.round(L)}`
    })
    plot.plot([{
        data: plot_data,
        style: 'impulse'
    }])
    
    // This is the quantum part of the algorithm. It is going to be slow. Classical computers are not capable of
    // Quantum parallelism, so every possible qbit values are calculated sequentially.
    return 16;
}

doFactor(15);

//console.log(fftUtil.fftMag(fft([0,1,0,2,0,1,0,2,0,1,0,2,0,1,0,2])));
//console.log(fftUtil.fftMag(fft([0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1])));
//console.log(fftUtil.fftMag(fft([0,1,0,-1,0,1,0,-1,0,1,0,-1,0,1,0,-1])));

process.exit(0);
