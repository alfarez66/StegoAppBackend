const HuffmanCoding = require('../service/Huffman-f4')
const RunLengthEncoding = require('../service/RLE')
const LZW = require('../service/lzw')
const JBitEncoding = require('../service/jbit')
const DeflateCompression = require('../service/deflate-rev')
const ArithmeticCoding = require('../service/arithmetic1')
const LSBSteganography = require('../service/LSB(1)')
const fs = require('fs');
const path = require('path');


module.exports = function(app,db){

    app.get('/a',(req,res)=>{
        res.send('Hello World')
    })
    app.get('/profile/:name',(req,res)=>{
        const name = req.params.name
        const detail = {'_id':name}
        res.send(detail)
    })
    
    //Embedding into stegoImage

    app.post('/encode/huffman', async (req, res) => {
        try {
            const text = req.body.text;
            const base64String = req.body.image;
            const binaryData = Buffer.from(base64String, 'base64');
            const inputImagePath = path.join(__dirname, '..', '..', 'public', 'input', 'coverimage.png');
            fs.writeFile(inputImagePath, binaryData, (err) => {
                if (err) {
                    console.error('Error saving the image:', err);
                } else {
                    console.log('Image saved successfully!');
                }
            });
            const outputImagePath = path.join(__dirname, '..', '..', 'public', 'output', 'stegoImage.png');
    
            if (typeof text !== 'string') {
                return res.status(400).json({ error: 'Invalid input. Text must be a string.' });
            }
    
            const Huffman = new HuffmanCoding();
            const lsbsteg = new LSBSteganography();
            const {encodedString, codes} = Huffman.encode(text)
            await lsbsteg.embedMessageInImage(inputImagePath, encodedString, outputImagePath)
            const outputImageBuffer = fs.readFileSync(outputImagePath);
            const base64OutputImage = outputImageBuffer.toString('base64');
            const object = { success:true, image: base64OutputImage, codes: codes }
            res.send(object)
        } catch (error) {
            console.error('Error occurred: ', error);
            res.status(500).json({ error: error.message });
        }
    });
    app.post('/encode/ac', async (req,res)=>{
        try{
            const text = req.body.text;
            const base64String = req.body.image;
            const binaryData = Buffer.from(base64String, 'base64');
            const inputImagePath = path.join(__dirname, '..', '..', 'public', 'input', 'coverimage.png');
            fs.writeFile(inputImagePath, binaryData, (err) => {
                if (err) {
                    console.error('Error saving the image:', err);
                } else {
                    console.log('Image saved successfully!');
                }
            });
            const outputImagePath = path.join(__dirname, '..', '..', 'public', 'output', 'stegoImage.png');
    
            if (typeof text !== 'string') {
                return res.status(400).json({ error: 'Invalid input. Text must be a string.' });
            }
            //encoding
            const ac = new ArithmeticCoding();
            const radix = 10
            const { diff, powr, freq} = await ac.arithmethicCoding(text,radix)
            console.log(diff.toString(2))

            const natFreq = {}
            for (const key in freq){
                natFreq[key] = Number(freq[key])
            }
            console.log(powr)
            //embedding
            const lsbsteg = new LSBSteganography()
            await lsbsteg.embedMessageInImage(inputImagePath,diff.toString(2),outputImagePath)
            const outputImageBuffer = fs.readFileSync(outputImagePath);
            const base64OutputImage = outputImageBuffer.toString('base64');
            const object ={success:true, image: base64OutputImage,powr:Number(powr),freq:natFreq}
            res.send(object)
        }catch(error){
            console.error('Error occured: ',error)
            res.status(500).send("Internal server error")
        }
    })
    app.post('/encode/deflate',async(req,res)=>{
        try{
            const text = req.body.text;
            const base64String = req.body.image;
            const binaryData = Buffer.from(base64String, 'base64');
            const inputImagePath = path.join(__dirname, '..', '..', 'public', 'input', 'coverimage.png');
            fs.writeFile(inputImagePath, binaryData, (err) => {
                if (err) {
                    console.error('Error saving the image:', err);
                } else {
                    console.log('Image saved successfully!');
                }
            });
            const outputImagePath = path.join(__dirname, '..', '..', 'public', 'output', 'stegoImage.png');
    
            if (typeof text !== 'string') {
                return res.status(400).json({ error: 'Invalid input. Text must be a string.' });
            }
    
            const compressor = new DeflateCompression();
            const lsbsteg = new LSBSteganography();
            const {binaryString,codes} = compressor.deflate(text);
            await lsbsteg.embedMessageInImage(inputImagePath, binaryString, outputImagePath)
            const outputImageBuffer = fs.readFileSync(outputImagePath);
            const base64OutputImage = outputImageBuffer.toString('base64');
            const object = { success:true, image: base64OutputImage, codes: codes }
            res.send(object)
        } catch(error) {
            console.error('Error occurred: ', error);
            res.status(500).json({ error: error.message });
        }
    })
    app.post('/encode/jbit',async (req,res)=>{
        try{
            const text = req.body.text;
            const base64String = req.body.image;
            const binaryData = Buffer.from(base64String, 'base64');
            const inputImagePath = path.join(__dirname, '..', '..', 'public', 'input', 'coverimage.png');
            fs.writeFile(inputImagePath, binaryData, (err) => {
                if (err) {
                    console.error('Error saving the image:', err);
                } else {
                    console.log('Image saved successfully!');
                }
            });
            const outputImagePath = path.join(__dirname, '..', '..', 'public', 'output', 'stegoImage.png');
    
            if (typeof text !== 'string') {
                return res.status(400).json({ error: 'Invalid input. Text must be a string.' });
            }
    
            const jbe = new JBitEncoding()
            const lsbsteg = new LSBSteganography();
            const encoded = jbe.encode(text);
            await lsbsteg.embedMessageInImage(inputImagePath, encoded, outputImagePath)
            const outputImageBuffer = fs.readFileSync(outputImagePath);
            const base64OutputImage = outputImageBuffer.toString('base64');
            const object = { success:true, image: base64OutputImage}
            res.send(object)
        } catch(error) {
            console.error('Error occurred: ', error);
            res.status(500).json({ error: error.message });
        }
    })
    app.post('/encode/lzw',async(req,res)=>{
        try{
            const text = req.body.text;
            const base64String = req.body.image;
            const binaryData = Buffer.from(base64String, 'base64');
            const inputImagePath = path.join(__dirname, '..', '..', 'public', 'input', 'coverimage.png');
            fs.writeFile(inputImagePath, binaryData, (err) => {
                if (err) {
                    console.error('Error saving the image:', err);
                } else {
                    console.log('Image saved successfully!');
                }
            });
            const outputImagePath = path.join(__dirname, '..', '..', 'public', 'output', 'stegoImage.png');
    
            if (typeof text !== 'string') {
                return res.status(400).json({ error: 'Invalid input. Text must be a string.' });
            }
            const lzw = new LZW()
            const lsbsteg = new LSBSteganography();
            const compressed = LZW.compress(text);
            // console.log(compressed.length)
            await lsbsteg.embedMessageInImage(inputImagePath, compressed, outputImagePath)
            const outputImageBuffer = fs.readFileSync(outputImagePath);
            const base64OutputImage = outputImageBuffer.toString('base64');
            const object = { success:true, image: base64OutputImage}
            res.send(object)
        }catch(error){
            console.error('Error occured: ',error)
            res.status(500).send('Internal server error')
        }
    })
    app.post('/encode/rle',async (req,res)=>{
        try{
            const text = req.body.text;
            const base64String = req.body.image;
            const binaryData = Buffer.from(base64String, 'base64');
            const inputImagePath = path.join(__dirname, '..', '..', 'public', 'input', 'coverimage.png');
            fs.writeFile(inputImagePath, binaryData, (err) => {
                if (err) {
                    console.error('Error saving the image:', err);
                } else {
                    console.log('Image saved successfully!');
                }
            });
            const outputImagePath = path.join(__dirname, '..', '..', 'public', 'output', 'stegoImage.png');
    
            if (typeof text !== 'string') {
                return res.status(400).json({ error: 'Invalid input. Text must be a string.' });
            }
            const rle = new RunLengthEncoding();
            const lsbsteg = new LSBSteganography();
            const encoded = rle.encode(text);
            console.log("The length of RLE Encoded message is "+encoded.length);
            await lsbsteg.embedMessageInImage(inputImagePath, encoded, outputImagePath)
            const outputImageBuffer = fs.readFileSync(outputImagePath);
            const base64OutputImage = outputImageBuffer.toString('base64');
            const object = { success:true, image: base64OutputImage}
            res.send(object)
        }catch(error){
            console.error('Error occured: ',error);
            res.status(500).send('Internal server error')
        }
    })
    
    //Extracting into text
    
    app.post('/decode/huffman',async (req,res)=>{
        try{
            //extracting
            const lsbsteg = new LSBSteganography();
            const base64String = req.body.image;
            const binaryData = Buffer.from(base64String, 'base64');
            const inputImagePath = path.join(__dirname, '..', '..', 'public', 'input', 'coverimage.png');
            fs.writeFile(inputImagePath, binaryData, (err) => {
                if (err) {
                    console.error('Error saving the image:', err);
                } else {
                    console.log('Image saved successfully!');
                }
            });
            const secretMessage = await lsbsteg.extractMessageFromImage(inputImagePath)
            //decoding
            const str = req.body.code;
            const codes = str.split('\n').reduce((acc, line) => {
                const [key, value] = line.split(': ');
                return {...acc, [key]: value};
            }, {});
            const Huffman = new HuffmanCoding();
            const decode = Huffman.decode(secretMessage,codes)
            const object ={success:true, text:decode}
            res.send(object)
        } catch(error) {
            console.error('Error occurred: ', error);
            res.status(500).json({ error: error.message });
        }
    })
    app.post('/decode/ac', async (req,res)=>{
        try{
            //extracting
            const lsbsteg = new LSBSteganography();
            const base64String = req.body.image;
            const binaryData = Buffer.from(base64String, 'base64');
            const inputImagePath = path.join(__dirname, '..', '..', 'public', 'input', 'coverimage.png');
            fs.writeFile(inputImagePath, binaryData, (err) => {
                if (err) {
                    console.error('Error saving the image:', err);
                } else {
                    console.log('Image saved successfully!');
                }
            });
            const secretMessage = await lsbsteg.extractMessageFromImage(inputImagePath)
            // console.log(secretMessage.length)
            //decoding
            const str = req.body.freq;
            const radix = 10
            const powr = BigInt(req.body.pwr);
            const codes = str.split('\n').reduce((acc, line) => {
                const [key, value] = line.split(': ');
                return {...acc, [key]: BigInt(value)};
            }, {});
            const ac = new ArithmeticCoding();
            console.log(    )
            const dediff = BigInt(`0b${secretMessage}`)
            const decode = await ac.arithmethicDecoding(dediff,radix,powr,codes)
            // console.log((codes))
            const object ={success:true, text:decode}
            res.send(object)
        } catch(error) {
            console.error('Error occurred: ', error);
            res.status(500).json({ error: error.message });
        }
    })
    app.post('/decode/deflate',async(req,res)=>{
        try{
            //extracting
            const lsbsteg = new LSBSteganography();
            const base64String = req.body.image;
            const binaryData = Buffer.from(base64String, 'base64');
            const inputImagePath = path.join(__dirname, '..', '..', 'public', 'input', 'coverimage.png');
            fs.writeFile(inputImagePath, binaryData, (err) => {
                if (err) {
                    console.error('Error saving the image:', err);
                } else {
                    console.log('Image saved successfully!');
                }
            });
            const secretMessage = await lsbsteg.extractMessageFromImage(inputImagePath)
            //decoding
            const str = req.body.code;
            const codes = str.split('\n').reduce((acc, line) => {
                const [key, value] = line.split(': ');
                return {...acc, [key]: value};
            }, {});
            const compressor = new DeflateCompression();
            const decompressedText = compressor.inflate(secretMessage,codes);
            console.log(secretMessage)
            const object ={success:true, text:decompressedText}
            res.send(object)
        } catch(error) {
            console.error('Error occurred: ', error);
            res.status(500).json({ error: error.message });
        }
    })
    app.post('/decode/jbit',async (req,res)=>{
        try{
            //extracting
            const lsbsteg = new LSBSteganography();
            const base64String = req.body.image;
            const binaryData = Buffer.from(base64String, 'base64');
            const inputImagePath = path.join(__dirname, '..', '..', 'public', 'input', 'coverimage.png');
            fs.writeFile(inputImagePath, binaryData, (err) => {
                if (err) {
                    console.error('Error saving the image:', err);
                } else {
                    console.log('Image saved successfully!');
                }
            });
            const secretMessage = await lsbsteg.extractMessageFromImage(inputImagePath)
            //decoding
            const jbe = new JBitEncoding()
            const decoded = jbe.decode(secretMessage);
            console.log(decoded)
            const object ={success:true, text:decoded}
            res.send(object)
        } catch(error) {
            console.error('Error occurred: ', error);
            res.status(500).json({ error: error.message });
        }
    })
    app.post('/decode/lzw',async(req,res)=>{
        try{
            //extracting
            const lsbsteg = new LSBSteganography();
            const base64String = req.body.image;
            const binaryData = Buffer.from(base64String, 'base64');
            const inputImagePath = path.join(__dirname, '..', '..', 'public', 'input', 'coverimage.png');
            fs.writeFile(inputImagePath, binaryData, (err) => {
                if (err) {
                    console.error('Error saving the image:', err);
                } else {
                    console.log('Image saved successfully!');
                }
            });
            const secretMessage = await lsbsteg.extractMessageFromImage(inputImagePath)
            //decoding
            const decompressed = LZW.decompress(secretMessage);
            console.log(decompressed.length)
            const object ={success:true, text:decompressed}
            res.send(object)
        } catch(error) {
            console.error('Error occurred: ', error);
            res.status(500).json({ error: error.message });
        }
    })
    app.post('/decode/rle',async (req,res)=>{
        try{
            //extracting
            const lsbsteg = new LSBSteganography();
            const base64String = req.body.image;
            const binaryData = Buffer.from(base64String, 'base64');
            const inputImagePath = path.join(__dirname, '..', '..', 'public', 'input', 'coverimage.png');
            fs.writeFile(inputImagePath, binaryData, (err) => {
                if (err) {
                    console.error('Error saving the image:', err);
                } else {
                    console.log('Image saved successfully!');
                }
            });
            const secretMessage = await lsbsteg.extractMessageFromImage(inputImagePath)
            //decoding
            const rle = new RunLengthEncoding();
            const decoded = rle.decode(secretMessage);
            console.log("The length of RLE Encoded message is "+decoded.length);
            const object ={success:true, text:decoded}
            res.send(object)
        }catch(error){
            console.error('Error occured: ',error);
            res.status(500).send('Internal server error')
        }
    })
}