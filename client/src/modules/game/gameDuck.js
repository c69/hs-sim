/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/21/17.
 */
import { createActions } from 'redux-actions'
import typeToReducer from 'type-to-reducer'

import { boardService } from '../../services'

const constants = {
  name: 'theGame',
  types: {
    HERO: 'HERO',
    SPELL: 'SPELL',
    MINION: 'MINION'
  },
  zones: {
    DECK: 'DECK',
    HAND: 'HAND',
    PLAY: 'PLAY',
    GRAVE: 'GRAVE',
    HERO: 'HERO'
  }
}
const types = {
  FETCH_GAME: 'FETCH_GAME'
}

const {fetchGame} = createActions(types.FETCH_GAME)

const actions = {}
actions.fetchGame = () => {
  return (dispatch, getState) => {
    return dispatch(fetchGame(boardService.fetchGame()))
  }
}

const initial = {
  game: {
    turn: undefined,
    isStarted: undefined,
    isOver: undefined,
    activePlayer: {},
    passivePlayer: {}
  },
  entities: [],
  actions: []
}

const reducer = typeToReducer({
  [types.FETCH_GAME]: {
    OK: (state, action) => ({...action.payload})
  }
}, initial)

export {
  constants,
  types,
  actions,
  reducer
}

export default reducer
