/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/25/17.
 */
const express = require('express')
const router = express.Router()
const debug = require('debug')('hs:service:game')

const validate = require('../middlewares/validate')
const postGameSchema = require('../schemas/postGame')

const hsGame = require('../../../dist/main_rpc')

router.get('/game', getGame)
router.post('/game/action', validate(postGameSchema), chooseGameAction)

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

function chooseGameAction (req, res) {
  const {
    optionIndex = 0,
    targetIndex = 0,
    positionIndex = 0
  } = req.body;

  // chooseOption should SOMEHOW return the result of tick,
  //-- maybe with animations, and maybe asynchronously
  const game = hsGame.chooseOption(
    'token', //token validation is disabled in Core, for now
    {
      optionIndex,
      targetIndex,
      positionIndex
    }
  );

  res.send(req.body);
}

module.exports.router = router
