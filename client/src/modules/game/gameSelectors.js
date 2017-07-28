/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/22/17.
 */
import { createSelector } from 'reselect';

import findIndex from 'lodash/findIndex';
import keyBy from 'lodash/keyBy';

import { constants } from './gameDuck';
import gameConstants from './gameConstants';

// const entitiesSelector = state => state[constants.name].entities
const gameSelector = state => state[constants.name].game;
const selectedSelector = state => state[constants.name].selected;
const actionsSelector = state => state[constants.name].actions;
const activePlayerSelector = state => state[constants.name].activePlayer;
const passivePlayerSelector = state => state[constants.name].passivePlayer;

export default {
  gameSelector,
  activePlayerSelector,
  passivePlayerSelector,
  targetsSelector: createSelector(
    selectedSelector,
    selected => keyBy(selected.targetList, 'card_id'),
  ),
  positionsSelector: createSelector(
    selectedSelector,
    selected => selected.positionList,
  ),
  selectedSelector: createSelector(
    selectedSelector,
    selected => selected,
  ),
  gameActionEndTurn: createSelector(
    actionsSelector,
    actions => findIndex(actions, { type: gameConstants.gameActions.END_TURN }),
  ),
};
