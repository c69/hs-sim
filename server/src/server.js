const debug = require('debug')('hs:server')

const app = require('./app')
const errors = require('./error')

function main () {
  debug('Loading main ...')
  // we can start services here (db, core and after that we can launch the server)
  return app.start()
}

process.on('uncaughtException', errors.uncaughtExceptionHandler)

debug(`To restart nodemon type 'rs' and hit Enter`)
debug(`Starting HS Server`)
main()
