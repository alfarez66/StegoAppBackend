class LZW {
    static compress(input) {
        let dictionary = new Map();
        let data = (input + "").split("");
        let out = [];
        let currChar;
        let phrase = data[0];
        let code = 256;
        for (let i=1; i<data.length; i++) {
            currChar = data[i];
            if (dictionary.has(phrase + currChar)) {
                phrase += currChar;
            } else {
                out.push(phrase.length > 1 ? dictionary.get(phrase) : phrase.charCodeAt(0));
                dictionary.set(phrase + currChar, code);
                code++;
                phrase = currChar;
            }
        }
        out.push(phrase.length > 1 ? dictionary.get(phrase) : phrase.charCodeAt(0));
        return out.map(a => this.toBinary(a, 12)).join(""); // Adjust bit length as needed
    }

    static decompress(input) {
        let dictionary = new Map();
        let data = [];
        for (let i = 0; i < input.length; i += 12) { // Match bit length from compression
            data.push(parseInt(input.substr(i, 12), 2));
        }
        let currChar = String.fromCharCode(data[0]);
        let oldPhrase = currChar;
        let out = [currChar];
        let code = 256;
        let phrase;
        for (let i = 1; i < data.length; i++) {
            let currCode = data[i];
            if (currCode < 256) {
                phrase = String.fromCharCode(currCode);
            } else {
                phrase = dictionary.get(currCode) ? dictionary.get(currCode) : (oldPhrase + currChar);
            }
            out.push(phrase);
            currChar = phrase.charAt(0);
            dictionary.set(code, oldPhrase + currChar);
            code++;
            oldPhrase = phrase;
        }
        return out.join("");
    }

    static toBinary(num, padding) {
        let bin = num.toString(2);
        return bin.padStart(padding, '0');
    }
}


module.exports = LZW;