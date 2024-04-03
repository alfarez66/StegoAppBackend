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

            image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
                for (let offset = 0; offset < 3; offset++) {
                    if (messageIndex < binaryMessageWithDelimiter.length) {
                        const bit = binaryMessageWithDelimiter[messageIndex];
                        image.bitmap.data[idx + offset] = (image.bitmap.data[idx + offset] & 0xFE) | parseInt(bit, 2);
                        messageIndex++;
                    } else {
                        return false; // Stop scanning if message is fully embedded
                    }
                }
            });

            await image.writeAsync(outputFilePath);
            console.log("Message embedded successfully.");
        } catch (error) {
            console.error("Error embedding message:", error);
            throw error; // Consider re-throwing the error or handling it more gracefully
        }
    }

    async extractMessageFromImage(filePath) {
        try {
            const image = await Jimp.read(filePath);
            const binaryDelimiter = '00000011';
            let binaryMessage = '';
            let delimiterFound = false;

            image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
                if (delimiterFound) return false; // Stop scanning if delimiter is found

                for (let offset = 0; offset < 3; offset++) {
                    const bit = image.bitmap.data[idx + offset] & 1;
                    binaryMessage += bit.toString();

                    if (binaryMessage.endsWith('00000011')) {
                        delimiterFound = true;
                        return false; // Stop scanning if delimiter is found
                    }
                }
            });

            binaryMessage = binaryMessage.slice(0, -binaryDelimiter.length); // Remove the delimiter
            const textMessage = this.binaryToString(binaryMessage);

            console.log("Message extracted successfully.");
            return textMessage;
        } catch (error) {
            console.error("Error extracting message:", error);
            throw error; // Consider re-throwing the error or handling it more gracefully
        }
    }

    binaryToString(binaryString) {
        return binaryString.split(' ').map(function (bin) {
            return String.fromCharCode(parseInt(bin, 2));
        }).join('');
    }
}

// Usage example
// (async () => {
//     const lsbSteg = new LSBSteganography();
//     const inputImagePath = path.join(__dirname, 'input', 'coverimage.png');
//     const outputImagePath = path.join(__dirname, 'output', 'stegoImage.png');
//     const binaryMessage = '1010100101001010110101010101000010100100101010101010110010';
//     await lsbSteg.embedMessageInImage(inputImagePath, binaryMessage, outputImagePath);
//     console.log("Stego image saved to:", outputImagePath);
//     const extractedTextMessage = await lsbSteg.extractMessageFromImage(outputImagePath);
//     console.log("Extracted Text Message:", extractedTextMessage);
// })();

module.exports = LSBSteganography;