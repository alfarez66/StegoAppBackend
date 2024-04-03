class JBitEncoding {
    // Helper method to convert a character to its binary representation
    static charToBinary(char) {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }
    
    // Helper method to convert binary to a character
    static binaryToChar(binary) {
        return String.fromCharCode(parseInt(binary, 2));
    }
    
    // Encoding method
    encode(text) {
        let tempByteData = '';
        let dataI = '';
        let dataII = '';
        for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const binaryChar = JBitEncoding.charToBinary(char);
        if (char === '\0') { // JavaScript uses '\0' for null character
            tempByteData += '0';
        } else {
            dataI += binaryChar; // Keep as binary
            tempByteData += '1';
        }
        if (tempByteData.length === 8) {
            dataII += tempByteData; // Keep as binary
            tempByteData = '';
        }
        }
        // Ensure the last tempByteData bits are processed
        if (tempByteData) {
        dataII += tempByteData.padEnd(8, '0');
        }
        // For simplicity, prepend the length of dataI as a binary string
        const lengthBinary = dataI.length.toString(2).padStart(32, '0'); // Use 32 bits to represent the length
        return lengthBinary + dataI + dataII;
    }
    
    // Decoding method
    decode(data) {
        const lengthBinary = parseInt(data.substring(0, 32), 2);
        let dataI = data.substring(32, 32 + lengthBinary);
        let dataII = data.substring(32 + lengthBinary);
    
        let output = '';
        let dataIndex = 0;
        for (let i = 0; i < dataII.length; i += 8) {
        const byte = dataII.substring(i, i + 8);
        for (let bit of byte) {
            if (bit === '1') {
            output += JBitEncoding.binaryToChar(dataI.substring(dataIndex, dataIndex + 8));
            dataIndex += 8;
            } else {
            output += '\0';
            }
        }
        }
        return output;
    }
    }
    
module.exports = JBitEncoding;