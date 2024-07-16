const Jimp = require('jimp');
const path = require('path');

class LSBSteganography {
  constructor() {}

  async embedMessageInImage(filePath, message, outputFilePath) {
    const messageBinary = message
      .split('')
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join('');

    const messageLengthBinary = messageBinary.length.toString(2).padStart(16, '0');
    console.log(messageLengthBinary.length);

    const binaryMessageWithLength = messageLengthBinary + messageBinary;
    let messageIndex = 0;

    try {
      const image = await Jimp.read(filePath);
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
        for(let i=0;i<2;i++){
          if(messageIndex<binaryMessageWithLength.length){
            const bit = binaryMessageWithLength[messageIndex];
            image.bitmap.data[idx + i] = (image.bitmap.data[idx + i] & 0xFE) | parseInt(bit, 2);
            messageIndex++;
          }
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
        for(let i=0;i<2;i++){
          const bit = image.bitmap.data[idx + i] & 1;
          binaryMessage += bit.toString();
        }
      });

      const messageLengthBinary = binaryMessage.substring(0, 16);
      console.log(messageLengthBinary);
      const messageLength = parseInt(messageLengthBinary, 2);
      const extractedBinaryMessage = binaryMessage.substring(16, 16 + messageLength);
      const extractedMessage = extractedBinaryMessage
        .match(/.{1,8}/g)
        .map(byte => String.fromCharCode(parseInt(byte, 2)))
        .join('');

      console.log("Message extracted successfully.");
      return extractedMessage;
    } catch (error) {
      console.error("Error extracting message:", error);
      return '';
    }
  }
}

module.exports = LSBSteganography;