class ArithmeticCoding {
    constructor() {}

    cumulativeFreq(freq) {
        let total = BigInt(0);
        let cf = {};
        for (let i = 0; i < 256; i++) {
            const b = String.fromCharCode(i);
            if (freq.hasOwnProperty(b)) {
                cf[b] = total;
                total += BigInt(freq[b]);
            }
        }
        return cf;
    }

    async arithmethicCoding(str, radix=10) {
        const chars = Array.from(str);
        const freq = chars.reduce((acc, c) => {
            acc[c] = (acc[c] || BigInt(0)) + BigInt(1);
            return acc;
        }, {});

        const cf = this.cumulativeFreq(freq);
        const base = BigInt(chars.length);
        let L = BigInt(0);
        let pf = BigInt(1);
        const bigBase = base;

        for (let c of chars) {
            const x = BigInt(cf[c]);
            L = L * bigBase + x * pf;
            pf = pf * BigInt(freq[c]);
        }

        let U = L + pf;
        const bigOne = BigInt(1);
        const bigZero = BigInt(0);
        const bigRadix = BigInt(radix);

        let tmp = pf;
        let powr = BigInt(0);

        while (tmp / bigRadix !== bigZero) {
            tmp = tmp / bigRadix;
            powr += bigOne;
        }

        const diff = (U - bigOne) / bigRadix ** powr;

        return { diff, powr, freq };
    }

    async arithmethicDecoding(num, radix, pow, freq) {
        const powr = BigInt(radix);
        let enc = num * powr ** pow;

        let base = Object.values(freq).reduce((acc, v) => acc + BigInt(v), BigInt(0));
        const cf = this.cumulativeFreq(freq);

        const dict = {};
        Object.entries(cf).forEach(([k, v]) => {
            dict[v] = k;
        });

        let lchar = -1;
        for (let i = BigInt(0); i < base; i++) {
            if (dict.hasOwnProperty(i)) {
                lchar = dict[i].charCodeAt(0);
            } else if (lchar !== -1) {
                dict[i] = String.fromCharCode(lchar);
            }
        }

        let decoded = '';
        for (let i = base - BigInt(1); i >= BigInt(0); i--) {
            const pow = base ** i;
            const div = enc / pow;
            const c = dict[Number(div)];
            const fv = BigInt(freq[c]);
            const cv = BigInt(cf[c]);

            const prod = pow * cv;
            const diff = enc - prod;
            enc = diff / fv;

            decoded = c + decoded;
        }

        return decoded.split('').reverse().join('');
    }
}
module.exports = ArithmeticCoding;