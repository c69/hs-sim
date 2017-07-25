/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/25/17.
 */
const express = require('express')
const router = express.Router()
const debug = require('debug')('hs:service:game')

const validate = require('../middlewares/validate')
const postGameSchema = require('../schemas/postGame')

const hsGame = require('../../../main_rpc')

router.get('/game', getGame)
router.post('/game/action', validate(postGameSchema), choseGameAction)

function getGame (req, res) {
  const gameStateJSON = hsGame.exportState()
  let gameState

  // TODO: Should be parsed & handled on games' side
  try {
    gameState = JSON.parse(gameStateJSON)
  } catch (error) {
    debug('Error %o', error)
    return res.status(500).send({message: 'Unable to parse game state', error})
  }

  res.send(gameState)
}

function choseGameAction (req, res) {
  hsGame.chooseOption('token', req.body.index)
  res.send(req.body)
  // let game = hs_game.chooseOption(req)
  //res.json(game); // this does not work, obviously
  // res.send(200)
}

module.exports.router = router
