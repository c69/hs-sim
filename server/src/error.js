/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/24/17.
 */
const debug = require('debug')('hs:error')
const C = require('config')

module.exports.uncaughtExceptionHandler = (error) => {
  switch (error.errno) {
    case 'EACCES':
      debug('Error: Port', C.get('app.port'), ' requires elevated privileges. Terminating!')
      process.exit(1) // eslint-disable-line no-process-exit
      break
    case 'EADDRINUSE':
      debug('Error: Port', C.get('app.port'), ' is already in use. Terminating!')
      process.exit(1) // eslint-disable-line no-process-exit
      break
    default:
      throw error
  }
}
