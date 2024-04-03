const fs = require('fs');

class LSBSteganography {
  constructor() {}

  async embedMessageInImage(filePath, message, outputFilePath) {
    const messageBinary = message
      .split('')
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join('');
    const messageLengthBinary = messageBinary.length.toString(2).padStart(16, '0');
    const binaryMessageWithLength = messageLengthBinary + messageBinary;

    try {
      const imageData = await fs.promises.readFile(filePath);
      const imageBuffer = Buffer.from(imageData);

      let messageIndex = 0;
      for (let i = 0; i < imageBuffer.length; i++) {
        if (messageIndex < binaryMessageWithLength.length) {
          const bit = binaryMessageWithLength[messageIndex];
          imageBuffer[i] = (imageBuffer[i] & 0xFE) | parseInt(bit, 2);
          messageIndex++;
        } else {
          break;
        }
      }

      await fs.promises.writeFile(outputFilePath, imageBuffer);
      console.log("Message embedded successfully.");
    } catch (error) {
      console.error("Error embedding message:", error);
    }
  }

  async extractMessageFromImage(filePath) {
    try {
      const imageData = await fs.promises.readFile(filePath);
      const imageBuffer = Buffer.from(imageData);

      let binaryMessage = '';
      for (let i = 0; i < imageBuffer.length; i++) {
        const bit = imageBuffer[i] & 1;
        binaryMessage += bit.toString();
      }

      const messageLengthBinary = binaryMessage.substring(0, 16);
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