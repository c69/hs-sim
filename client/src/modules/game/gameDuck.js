/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/21/17.
 */
import { createActions } from 'redux-actions';
import typeToReducer from 'type-to-reducer';

import { gameService } from '../../services';
import gameAdapter from './gameAdapter';
import gameSelectors from './gameSelectors';

const constants = {
  name: 'hs',
};

const types = {
  FETCH_GAME: 'hs/FETCH_GAME',
  END_TURN: 'hs/END_TURN',
  GAME_ACTION: 'hs/GAME_ACTION',
  SELECT_CARD: 'hs/SELECT_CARD',
  SELECT_TARGET: 'hs/SELECT_TARGET',
  SELECT_POSITION: 'hs/SELECT_POSITION',
};

const {
  hs: {
    fetchGame,
    gameAction,
    selectCard,
    selectTarget,
    selectPosition,
  },
} = createActions({
  [types.FETCH_GAME]: promise => promise.then(gameAdapter.massageGame),
  [types.GAME_ACTION]: undefined,
  [types.END_TURN]: undefined,
  [types.SELECT_CARD]: undefined,
  [types.SELECT_TARGET]: undefined,
  [types.SELECT_POSITION]: undefined,
});

// Sync Actions
const actions = {
  selectCard,
};

// Async Actions
actions.fetchGame = () => dispatch => dispatch(fetchGame(gameService.fetchGame()));

// TODO: not sure if we need a separate action for this
actions.endTurn = params => dispatch => dispatch(gameAction(gameService.gameAction(params)))
  .then(dispatch(actions.fetchGame()));

/**
 * Play selected card at selected position
 * Currently selected card state is stored in `selected`
 * @param positionIndex {Number} Index of selected position where the card should be placed
 * @returns {function(*, *)}
 */
actions.selectPosition = positionIndex => (dispatch, getState) => {
  const selected = gameSelectors.selectedSelector(getState());
  const params = {
    optionIndex: selected.actionIndex,
    positionIndex,
  };

  // This action is not handled in redux store for now, just firing it to see it in devTools
  dispatch(selectPosition(params));

  return dispatch(gameAction(gameService.gameAction(params)))
    .then(dispatch(actions.fetchGame()));
};

/**
 *
 */
// actions.selectTarget = (targetIndex) => {
actions.selectTarget = targetCardId => (dispatch, getState) => {
  const selected = gameSelectors.selectedSelector(getState());
  const params = {
    optionIndex: selected.actionIndex,
    targetIndex: selected.targetList.findIndex(target => target.card_id === targetCardId),
    // ,positionIndex
  };

    // This action is not handled in redux store for now, just firing it to see it in devTools
  dispatch(selectTarget(params));

  return dispatch(gameAction(gameService.gameAction(params)))
    .then(dispatch(actions.fetchGame()));
};

const initial = {
  selected: {
    cardId: undefined,
    type: undefined,
    targetList: [],
    positionList: [],
  },

  // filled by massageGame
  activePlayer: {
    zones: [],
  },
  passivePlayer: {
    zones: [],
  },

  // filled by FETCH_GAME response
  game: {
    turn: undefined,
    isStarted: undefined,
    isOver: undefined,
    activePlayer: {},
    passivePlayer: {},
  },
  entities: [],
  actions: [],
};

const reducer = typeToReducer({
  [types.FETCH_GAME]: {
    OK: (state, action) => ({

      // TODO: Anti-pattern, bad -> we're going to rewrite entire state with action payload.
      // Consider more precise usage
      ...state,
      ...action.payload,
    }),
  },
  [types.SELECT_CARD]: (state, action) => (
    {
      ...state,
      selected: action.payload,
    }
  ),
}, initial);

export {
  constants,
  types,
  actions,
  reducer,
};

export default reducer;
