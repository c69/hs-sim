/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/18/17.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import map from 'lodash/map'

import { gameActions, gameSelectors, gameConstants } from '../modules'

import {
  BoardGrid,
  EndTurn,
  History,
  PlayerDeck,
  PlayerHand,
  PlayerHero,
  PlayerMana,
  PlayerPlay,
  OpponentDeck,
  OpponentHand,
  OpponentHero,
  OpponentMana,
  OpponentPlay
} from './index'

// TODO: restructure - move out into Card dir and export multiple cards, TBD
import { HandCard, PlayCard, HeroCard } from './'

@connect(
  state => ({
    endTurnActionIndex: gameSelectors.gameActionEndTurn(state),

    game: gameSelectors.gameSelector(state),
    playerEntitiesByZone: gameSelectors.playerEntitiesByZone(state),
    opponentEntitiesByZone: gameSelectors.opponentEntitiesByZone(state)
  }),
  dispatch => ({
    fetchGame: () => dispatch(gameActions.fetchGame()),
    endTurn: (params) => dispatch(gameActions.endTurn(params))
  })
)
export default class Board extends Component {
  static propTypes = {
    entities: PropTypes.string,
    endTurn: PropTypes.func.isRequired,
    fetchGame: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.props.fetchGame()
  }

  render () {
    const {activePlayer, passivePlayer, turn, isStarted, isOver} = this.props.game
    const {playerEntitiesByZone, opponentEntitiesByZone, endTurnActionIndex} = this.props

    // TODO: update this with more graceful loading process
    if (!playerEntitiesByZone || !opponentEntitiesByZone) {
      return <div>Loading</div>
    }

    return (
      <BoardGrid>
        {/*Extra*/}
        <History>History<br />Turn {turn}</History>
        <EndTurn>
          {(endTurnActionIndex !== -1) && <button onClick={() => this.props.endTurn({option: endTurnActionIndex})}>End Turn</button>}
          <button onClick={() => this.props.endTurn({option: 0})}>Whatever First Action</button>
        </EndTurn>

        {/*Player*/}
        <PlayerDeck>
          {map(
            playerEntitiesByZone[gameConstants.zones.DECK],
            entity => <PlayCard key={entity.id + entity.card_id} {...entity} deck />
          )}
        </PlayerDeck>
        <PlayerMana>Mana {activePlayer.mana} / {activePlayer.manaCrystals}</PlayerMana>
        <PlayerHand>
          {map(
            playerEntitiesByZone[gameConstants.zones.HAND],
            entity => <PlayCard key={entity.id + entity.card_id} {...entity} hand />
          )}
        </PlayerHand>
        <PlayerHero>
          {map(
            playerEntitiesByZone[gameConstants.zones.HERO],
            entity => <HeroCard key={entity.id + entity.card_id} {...entity} />
          )}
        </PlayerHero>
        <PlayerPlay>
          {map(
            playerEntitiesByZone[gameConstants.zones.PLAY],
            entity => <PlayCard key={entity.id + entity.card_id} {...entity} play />
          )}
        </PlayerPlay>

        {/*Opponent*/}
        <OpponentDeck>
          {map(
            opponentEntitiesByZone[gameConstants.zones.DECK],
            entity => <PlayCard key={entity.id + entity.card_id} {...entity} deck />
          )}
        </OpponentDeck>
        <OpponentMana>Mana {passivePlayer.mana} / {passivePlayer.manaCrystals}</OpponentMana>
        <OpponentHand>
          {map(
            opponentEntitiesByZone[gameConstants.zones.HAND],
            entity => <PlayCard key={entity.id + entity.card_id} {...entity} hand back />
          )}
        </OpponentHand>
        <OpponentHero>
          {map(
            opponentEntitiesByZone[gameConstants.zones.HERO],
            entity => <HeroCard key={entity.id + entity.card_id} {...entity} />
          )}
        </OpponentHero>
        <OpponentPlay>
          {map(
            opponentEntitiesByZone[gameConstants.zones.PLAY],
            entity => <PlayCard key={entity.id + entity.card_id} {...entity} play />
          )}
        </OpponentPlay>
      </BoardGrid>
    )
  }
}
