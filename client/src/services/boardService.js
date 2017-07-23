/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/22/17.
 */
import api from './apiService'
import gameMock from '../mocks/gameMock'
import yup from 'yup'

// import _ from 'lodash'
// console.log(_.uniq(_.map(gameMock.entities, 'zone')))

const cardIdSchema = yup.number().positive().integer()

const playerSchema = yup.object().shape({
  'name': yup.string().required(),
  'mana': yup.number().positive().integer().max(10).required(),
  'manaCrystals': yup.number().positive().integer().max(10).required(),
  'lost': yup.bool().required()
})

const gameSchema = yup.object().shape({
  'turn': yup.number().positive().integer().required(),
  'isStarted': yup.bool().required(),
  'isOver': yup.bool().required(),
  'activePlayer': playerSchema,
  'passivePlayer': playerSchema
})

const entitySchema = yup.object().shape({
  'id': yup.string().required(),
  'type': yup.string().required(),
  'name': yup.string().required(),
  'playerClass': yup.string().required(),
  'rarity': yup.string().required(),
  'zone': yup.string().required(),
  'owner': yup.string().required(),
  'card_id': cardIdSchema.required(),
  // optional
  'incomingAuras': yup.array(),
  'tags': yup.array(),
  'text': yup.string(),
  'health': yup.number().positive().integer(),
  'healthMax': yup.number().positive().integer(),
  'attack': yup.number().positive().integer(),
  'attackBase': yup.number().positive().integer(),
  'armor': yup.number().positive().integer(),
  'attackedThisTurn': yup.number().positive().integer()
})

const actionsSchema = yup.object().shape({
  'card_id': cardIdSchema,
  'type': yup.string().required(),
  'name': yup.string().required(),
  'targetList': yup.array(),
  'positionList': yup.array()
})

const gameFullSchema = yup.object().shape({
  game: gameSchema,
  entities: yup.array().of(entitySchema),
  actions: yup.array().of(actionsSchema)
})

export const fetchGame = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      gameFullSchema.validate(gameMock)
        .then((valid) => resolve(gameMock))
        .catch(error => reject(error))
    }, 300)
  })
}

export default {
  fetchGame
}
