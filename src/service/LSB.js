const Jimp = require('jimp');
const path = require('path');

class LSBSteganography {
  constructor() {}

  async embedMessageInImage(filePath, binaryMessage, outputFilePath) {
    const messageLengthBinary = binaryMessage.length.toString(2).padStart(16, '0');
    const binaryMessageWithLength = messageLengthBinary + binaryMessage;
    let messageIndex = 0;
    try {
      const image = await Jimp.read(filePath);
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
        if (messageIndex < binaryMessageWithLength.length) {
          const bit = binaryMessageWithLength[messageIndex];
          image.bitmap.data[idx] = (image.bitmap.data[idx] & 0xFE) | parseInt(bit, 2);
          messageIndex++;
        }
        if (messageIndex >= binaryMessageWithLength.length) return false;
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
        const bit = image.bitmap.data[idx] & 1;
        binaryMessage += bit.toString();
      });
      const messageLengthBinary = binaryMessage.substring(0, 16);
      const messageLength = parseInt(messageLengthBinary, 2);
      const extractedBinaryMessage = binaryMessage.substring(16, 16 + messageLength);
      console.log("Message extracted successfully.");
      return extractedBinaryMessage;
    } catch (error) {
      console.error("Error extracting message:", error);
      return '';
    }
  }
}

module.exports = LSBSteganography;