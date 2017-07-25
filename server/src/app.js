/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/24/17.
 */
const express = require('express')
const path = require('path')
const compression = require('compression')
const debug = require('debug')('hs:app')
const bodyParser = require('body-parser')
const C = require('config')

const gameService = require('./services/game')
const app = express()

app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')

app.use((req, res, next) => {
  debug('Request %s %s %o', req.method, req.originalUrl, req.body)
  next()
})

app.use('/api', gameService.router)

app.get('/', function (req, res) {
  res.render('index')
})

function start () {
  return new Promise((resolve, reject) => {
    app.listen(C.get('app.port'), (error) => {
      if (error) {
        debug(`Error: Unable to start the server. %o`, error)
        return reject(error)
      }

      debug(`Started HS App on port %d`, C.get('app.port'))
      return resolve(app)
    })
  })
}

module.exports = {app, start}
