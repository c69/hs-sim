/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/22/17.
 */
import yup from 'yup';
import api from './apiService';

const cardIdSchema = yup.number().positive().integer();

const playerSchema = yup.object().shape({
  name: yup.string().required(),
  mana: yup.number().positive().integer().max(10)
    .required(),
  manaCrystals: yup.number().positive().integer().max(10)
    .required(),
  lost: yup.bool().required(),
});

const gameSchema = yup.object().shape({
  turn: yup.number().positive().integer().required(),
  isStarted: yup.bool().required(),
  isOver: yup.bool().required(),
  activePlayer: playerSchema,
  passivePlayer: playerSchema,
});

const entitySchema = yup.object().shape({
  id: yup.string().required(),
  type: yup.string().required(),
  name: yup.string().required(),
  playerClass: yup.string().required(),
  zone: yup.string().required(),
  owner: yup.string().required(),
  card_id: cardIdSchema.required(),

  // optional
  rarity: yup.string(),
  incomingAuras: yup.array(),
  tags: yup.array(),
  text: yup.string(),
  health: yup.number().integer(),
  healthMax: yup.number().positive().integer(),
  attack: yup.number().positive().integer(),
  attackBase: yup.number().positive().integer(),
  armor: yup.number().positive().integer(),
  attackedThisTurn: yup.number().positive().integer(),
});

const actionsSchema = yup.object().shape({
  card_id: cardIdSchema,
  type: yup.string().required(),
  name: yup.string(),
  targetList: yup.array(),
  positionList: yup.array(),
});

const gameFullSchema = yup.object().shape({
  game: gameSchema,
  entities: yup.array().of(entitySchema),
  actions: yup.array().of(actionsSchema),
});

export const fetchGame = () => api.get('/game').then(data => gameFullSchema.validate(data));

export const gameAction = params => api.post('/game/action', params);

export default {
  fetchGame,
  gameAction,
};
