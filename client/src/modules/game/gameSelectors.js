/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/22/17.
 */
import { createSelector } from 'reselect'

import filter from 'lodash/filter'
import findIndex from 'lodash/findIndex'

import { constants } from './gameDuck'

const gameSelector = state => state[constants.name].game
const entitiesSelector = state => state[constants.name].entities
const actionsSelector = state => state[constants.name].actions

// TODO: Refactor
function groupByZones (entities, owner) {
  const playerEntities = filter(entities, {owner})
  // groupBy zone + add HERO zone
  return playerEntities.reduce((result, entity) => {
    // Extracting a new zone "HERO" by entity.type === HERO
    if (entity.type === constants.types.HERO) {
      // TODO: ideally we don't want to use array for hero zone, just plain object
      result[constants.types.HERO] = [entity]
    } else {
      // ugly
      // simply groupBy zone
      if (result[entity.zone]) {
        result[entity.zone].push(entity)
      } else {
        result[entity.zone] = [entity]
      }
    }

    return result
  }, {})
}

export default {
  gameSelector,
  playerEntitiesByZone: createSelector(
    gameSelector,
    // TODO: consider moving this logic to game service and massage the data upon arrival instead
    // this will allow to see the state in redux DevTools the way it is passed to components instead of "virtual" selectors
    entitiesSelector,
    (game, entities) => {
      if (entities.length) return groupByZones(entities, game.activePlayer.name)
    }
  ),
  opponentEntitiesByZone: createSelector(
    gameSelector,
    // TODO: consider moving this logic to game service and massage the data upon arrival instead
    // this will allow to see the state in redux DevTools the way it is passed to components instead of "virtual" selectors
    entitiesSelector,
    (game, entities) => {
      if (entities.length) return groupByZones(entities, game.passivePlayer.name)
    }
  ),
  gameActionEndTurn: createSelector(
    actionsSelector,
    actions => {
      return findIndex(actions, {type: 'END_TURN'})
    }
  )
}
