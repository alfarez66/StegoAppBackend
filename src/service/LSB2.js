const Jimp = require('jimp');
const path = require('path');

class LSBSteganography {
    constructor() {}

    async embedMessageInImage(filePath, binaryMessage, outputFilePath) {
        const binaryDelimiter = '00000011';
        const binaryMessageWithDelimiter = binaryMessage + binaryDelimiter;
    
        let messageIndex = 0;
    
        try {
            const image = await Jimp.read(filePath);
    
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
                for (let offset = 0; offset < 3; offset++) {
                    if (messageIndex < binaryMessageWithDelimiter.length) {
                        const bit = binaryMessageWithDelimiter[messageIndex];
                        image.bitmap.data[idx + offset] = (image.bitmap.data[idx + offset] & 0xFE) | parseInt(bit, 2);
                        messageIndex++;
                    }
                }
                if (messageIndex >= binaryMessageWithDelimiter.length) return false;
            });
    
            await image.writeAsync(outputFilePath);
            console.log("Message embedded successfully.");
        } catch (error) {
            console.error("Error embedding message:", error);
        }
    }
    async extractMessageFromImage(filePath) {
        try {
            const image = await Jimp.read(filePath);
            let binaryMessage = '';
    
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
                for (let offset = 0; offset < 3; offset++) {
                    const bit = image.bitmap.data[idx + offset] & 1;
                    binaryMessage += bit.toString();
                }
            });
            const delimiterIndex = binaryMessage.indexOf('00000011');
            if (delimiterIndex !== -1) {
                binaryMessage = binaryMessage.substring(0, delimiterIndex);
            }
    
            console.log("Message extracted successfully.");
            return binaryMessage;
        } catch (error) {
            console.error("Error extracting message:", error);
            return '';
        }
    }
    
    
    
    
}

module.exports = LSBSteganography