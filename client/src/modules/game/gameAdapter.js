/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/26/17.
 */
import gameConstants from './gameConstants'

/**
 * Main game massager :)
 * Create an object with game ZONES for player and the opponent (Format convenient for Board component consumption)
 * @param payload
 * @return {Object} Game state object that is used by game reducer
 */
function massageGame (payload) {
  const playerName = payload.game.activePlayer.name
  const opponentName = payload.game.passivePlayer.name
  const actionsByCardId = buildActionsByCardId(payload.actions)

  // TODO: this can be improved further. Right now groupByPlayerZones iterates over all possible entities twice.
  return {
    ...payload,
    activePlayer: {
      ...payload.game.activePlayer,
      zones: groupByPlayerZones(payload.entities, playerName, actionsByCardId)
    },
    passivePlayer: {
      ...payload.game.passivePlayer,
      zones: groupByPlayerZones(payload.entities, opponentName, actionsByCardId)
    }
  }
}

/**
 * Creates a hash of possible actions with card_id as keys.
 * Used to make action and card(entity) matching easier/faster (currently happens in groupByPlayerZones)
 * {
 *   [card_id]: action
 * }
 * @param actions
 * @returns {*}
 */
function buildActionsByCardId (actions = []) {
  return actions.reduce((result, action, actionIndex) => {
    if (action.card_id) {
      result[action.card_id] = action
      result[action.card_id].actionIndex = actionIndex
    }
    return result
  }, {})
}

/**
 * 1. Creates an object with keys as ZONES and values are an array of entities to be shown on the board
 * {
 *  HAND: [{}, {}, ...]
 *  PLAY: [{}, {}, ...]
 *  ...
 * }
 *
 * 2. Populate entities with actions that are available to them
 *
 * @param entities {Array} List of all entities available at current turn/game
 * @param owner {String} Player identifier (name or ID)
 * @param actionsByCardId {Array} List of all actions available for the player at current turn
 * @returns {*}
 */
export function groupByPlayerZones (entities, owner, actionsByCardId) {
  const playerEntities = entities.filter(entity => entity.owner === owner)
  return playerEntities.reduce((result, entity) => {
    // If Entity type is Hero we push it into a separate HERO zone
    const zone = getCardZone(entity, gameConstants.types.HERO)
    // set card action if it matches
    if (actionsByCardId[entity.card_id]) {
      entity.action = actionsByCardId[entity.card_id]
    }
    // const action = actionsByCardId[entity.card_id]

    if (result[zone]) {
      result[zone].push(entity)
    } else {
      result[zone] = [entity]
    }

    return result
  }, {})
}

/**
 * Return entity zone. For special card types (i.e. HERO) that type will be used instead of its zone
 * TODO: a bit dirty approach but we need to make our data convenient for the View
 * @param entity
 * @param heroType
 * @returns {*}
 */
function getCardZone (entity, heroType) {
  const isSpecialType = entity.type === heroType
  return isSpecialType ? entity.type : entity.zone
}

export default {
  massageGame,
  groupByZones: groupByPlayerZones
}
