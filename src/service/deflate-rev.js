class DeflateCompression {
    constructor(searchBufSize = 1024, lookaheadBufSize = 32) {
        this.searchBufSize = searchBufSize;
        this.lookaheadBufSize = lookaheadBufSize;
        this.codes = {}; // Initialize codes property
        this.reverseCodes = {};
    }

    lz77Compress(input) {
        let output = [];
        let pos = 0;

        while (pos < input.length) {
            let maxMatch = { length: 0, distance: 0 };
            let bufStart = Math.max(pos - this.searchBufSize, 0);

            for (let i = bufStart; i < pos; i++) {
                let matchLength = 0;
                while (input[i + matchLength] === input[pos + matchLength] && (pos + matchLength) < input.length && matchLength < this.lookaheadBufSize) {
                    matchLength++;
                }
                if (matchLength > maxMatch.length) {
                    maxMatch = { length: matchLength, distance: pos - i };
                }
            }

            if (maxMatch.length >= 3) {
                output.push({ distance: maxMatch.distance, length: maxMatch.length });
                pos += maxMatch.length;
            } else {
                output.push({ char: input[pos++] });
            }
        }

        return output;
    }

    generateHuffmanCodes(frequencies) {
        let priorityQueue = Object.entries(frequencies).map(([symbol, freq]) => ({
            symbol,
            freq,
            left: null,
            right: null
        })).sort((a, b) => a.freq - b.freq);

        while (priorityQueue.length > 1) {
            let left = priorityQueue.shift();
            let right = priorityQueue.shift();
            let newNode = { symbol: null, freq: left.freq + right.freq, left, right };
            priorityQueue.push(newNode);
            priorityQueue.sort((a, b) => a.freq - b.freq);
        }

        let codes = {};
        const traverse = (node, path = '') => {
            if (node.symbol) {
                codes[node.symbol] = path;
                return;
            }
            if (node.left) traverse(node.left, path + '0');
            if (node.right) traverse(node.right, path + '1');
        };
        traverse(priorityQueue[0]);

        return codes;
    }

    huffmanEncode(data, codes) {
        return data.map(item => {
            if (item.char !== undefined) {
                return codes[item.char];
            } else {
                // Use `_` as an escape character
                return codes[`_${item.distance}_${item.length}`];
            }
        }).join('');
    }

    invertCodes(codes) {
        const inverted = {};
        for (const [symbol, code] of Object.entries(codes)) {
            inverted[code] = symbol;
        }
        return inverted;
    }

    huffmanDecode(binaryString, codes) {
        const invertedCodes = this.invertCodes(codes);
        let decodedItems = [];
        let code = '';
        for (let bit of binaryString) {
            code += bit;
            if (invertedCodes.hasOwnProperty(code)) {
                let symbol = invertedCodes[code];
                if (symbol.startsWith('_')) {
                    const match = symbol.slice(1).split('_');
                    decodedItems.push({ distance: parseInt(match[0]), length: parseInt(match[1]) });
                } else {
                    decodedItems.push({ char: symbol });
                }
                code = '';
            }
        }
        return decodedItems;
    }

    lz77Decompress(encodedItems) {
        let output = '';
        for (const item of encodedItems) {
            if (item.char !== undefined) {
                output += item.char;
            } else {
                let start = Math.max(output.length - item.distance, 0);
                let pattern = '';
                for (let i = 0; i < item.length; i++) {
                    pattern += output[start + i % item.distance];
                }
                output += pattern;
            }
        }
        return output;
    }

    deflate(input) {
        const lz77Output = this.lz77Compress(input);
        const frequencies = lz77Output.reduce((acc, item) => {
            const symbol = item.char !== undefined ? item.char : `_${item.distance}_${item.length}`;
            acc[symbol] = (acc[symbol] || 0) + 1;
            return acc;
        }, {});

        this.codes = this.generateHuffmanCodes(frequencies); // Save codes for later use in inflation
        const encoded = this.huffmanEncode(lz77Output, this.codes);
        return { binaryString: encoded, codes: this.codes };
    }

    inflate(binaryString, codes = null) {
        this.codes = codes;
        if (!this.codes) {
            throw new Error("Huffman codes not found. Please compress before decompressing.");
        }
        const decodedItems = this.huffmanDecode(binaryString, this.codes);
        return this.lz77Decompress(decodedItems);
    }
}

module.exports = DeflateCompression;
