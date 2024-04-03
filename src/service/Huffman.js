class HuffmanCoding {
    constructor() {
        this.root = null;
        this.codes = {};
        this.reverseCodes = {};
    }

    calculateFrequencies(text) {
        let freqMap = {};
        for (let char of text) {
            if (!freqMap[char]) freqMap[char] = 0;
            freqMap[char]++;
        }
        return freqMap;
    }

    createPriorityQueue(freqMap) {
        let priorityQueue = [];
        for (let char in freqMap) {
            priorityQueue.push({ char: char, freq: freqMap[char], left: null, right: null });
        }
        priorityQueue.sort((a, b) => a.freq - b.freq);
        return priorityQueue;
    }

    buildTree(text) {
        const freqMap = this.calculateFrequencies(text);
        const priorityQueue = this.createPriorityQueue(freqMap);
        while (priorityQueue.length > 1) {
            let left = priorityQueue.shift();
            let right = priorityQueue.shift();
            let sum = left.freq + right.freq;
            let node = { freq: sum, left: left, right: right, char: undefined };
            priorityQueue.push(node);
            priorityQueue.sort((a, b) => a.freq - b.freq);
        }
        this.root = priorityQueue[0];
    }

    generateCodes(node = this.root, path = "") {
        if (!node) return;
        if (node.char !== undefined) {
            this.codes[node.char] = path;
            this.reverseCodes[path] = node.char;
        } else {
            this.generateCodes(node.left, path + "0");
            this.generateCodes(node.right, path + "1");
        }
    }

    encode(text) {
        this.root = null; // Reset root to ensure tree is rebuilt for new encoding
        this.codes = {};
        this.reverseCodes = {};
        this.buildTree(text);
        this.generateCodes();
        let binaryString = "";
        for (let char of text) {
            binaryString += this.codes[char];
        }
        return { encodedString: binaryString, codes: this.codes };
    }

    decode(binaryString, codes = null) {
        if (codes) {
            this.setCodes(codes);
        } else if (!this.root && Object.keys(this.reverseCodes).length === 0) {
            console.error("Error: Huffman tree or codes are not set.");
            return null;
        }

        let decodedString = "";
        let currentCode = "";
        for (let bit of binaryString) {
            currentCode += bit;
            if (this.reverseCodes[currentCode]) {
                decodedString += this.reverseCodes[currentCode];
                currentCode = "";
            }
        }
        return decodedString;
    }

    setCodes(codes) {
        this.codes = codes;
        this.reverseCodes = {};
        for (const [char, code] of Object.entries(codes)) {
            this.reverseCodes[code] = char;
        }
    }
}

module.exports = HuffmanCoding;