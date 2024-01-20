const app = require('./app') 
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
const { text } = require('express')
const test = require('./test/test.js');

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})


test.go();