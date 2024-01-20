const config = require('./utils/config')
const express = require('express')
const apirouter = require('./controllers/api')
const session = require('express-session')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')


logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({encoded : true}));
app.use(session({
  secret : 'narutoxhinata',
  maxAge : 604800000
}));




app.get('/' , (request ,response) =>{
  return response.status(200).send('Hi')
})

app.use(middleware.requestLogger)

app.use('/api', apirouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app



