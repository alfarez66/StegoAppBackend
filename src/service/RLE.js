class RunLengthEncoding {
    constructor() {
        this.charBitLength = 8; // Assuming ASCII characters
        this.countBitLength = 8; // Allows for counts up to 255
    }

    encode(text) {
        let encoded = '';
        let i = 0;

        while (i < text.length) {
            let count = 1;
            while (i + 1 < text.length && text[i] === text[i + 1]) {
                count++;
                i++;
            }

            // Convert character and count to binary and pad them
            let charBinary = text.charCodeAt(i).toString(2).padStart(this.charBitLength, '0');
            let countBinary = count.toString(2).padStart(this.countBitLength, '0');

            encoded += charBinary + countBinary;
            i++;
        }

        return encoded;
    }

    decode(encoded) {
        let decoded = '';
        for (let i = 0; i < encoded.length; i += this.charBitLength + this.countBitLength) {
            let charBinary = encoded.substring(i, i + this.charBitLength);
            let countBinary = encoded.substring(i + this.charBitLength, i + this.charBitLength + this.countBitLength);

            let charCode = parseInt(charBinary, 2);
            let count = parseInt(countBinary, 2);

            decoded += String.fromCharCode(charCode).repeat(count);
        }

        return decoded;
    }
}

module.exports = RunLengthEncoding;