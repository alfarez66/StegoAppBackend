const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')



const app = express()
app.use(cors()) 
app.use(express.json({limit:'50mb'}))

app.use(express.static('public'))
const PORT = process.env.PORT || 3000
app.use(bodyParser.urlencoded({ extended: true }))
require('./routes')(app,{})
app.listen(PORT,()=>console.info(`Server live on ${PORT}`))