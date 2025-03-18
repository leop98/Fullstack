const app = require('./app') // varsinainen Express-sovellus
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  console.log(`NODE_ENV is: ${process.env.NODE_ENV}`)

  logger.info(`Server running on port ${config.PORT}`)
})