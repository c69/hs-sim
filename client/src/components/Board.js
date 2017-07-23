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
} from './BoardStyled'

// TODO: restructure - move out into Card dir and export multiple cards, TBD
import { HandCard, PlayCard, HeroCard } from './'

@connect(
  state => ({
    game: gameSelectors.gameSelector(state),
    playerEntitiesByZone: gameSelectors.playerEntitiesByZone(state),
    opponentEntitiesByZone: gameSelectors.opponentEntitiesByZone(state)
  }),
  dispatch => ({
    fetchGame: () => dispatch(gameActions.fetchGame())
  })
)
export default class Board extends Component {
  static propTypes = {
    entities: PropTypes.string
  }

  componentDidMount () {
    this.props.fetchGame()
  }

  render () {
    const {activePlayer, passivePlayer, turn, isStarted, isOver} = this.props.game
    const {playerEntitiesByZone, opponentEntitiesByZone} = this.props

    // TODO: update this with more graceful loading process
    if (!playerEntitiesByZone || !opponentEntitiesByZone) {
      return <div>Loading</div>
    }

    return (
      <BoardGrid>
        {/*Extra*/}
        <History>History<br />Turn {turn}</History>

        {/*Player*/}
        <PlayerDeck>
          {map(
            playerEntitiesByZone[gameConstants.zones.DECK],
            entity => <PlayCard key={entity.id} {...entity} deck />
          )}
        </PlayerDeck>
        <PlayerMana>Mana {activePlayer.mana} / {activePlayer.manaCrystals}</PlayerMana>
        <PlayerHand>
          {map(
            playerEntitiesByZone[gameConstants.zones.HAND],
            entity => <PlayCard key={entity.id} {...entity} hand />
          )}
        </PlayerHand>
        <PlayerHero>
          {map(
            playerEntitiesByZone[gameConstants.zones.HERO],
            entity => <HeroCard key={entity.id} {...entity} />
          )}
        </PlayerHero>
        <PlayerPlay>
          {map(
            playerEntitiesByZone[gameConstants.zones.PLAY],
            entity => <PlayCard key={entity.id} {...entity} play />
          )}
        </PlayerPlay>

        {/*Opponent*/}
        <OpponentDeck>
          {map(
            opponentEntitiesByZone[gameConstants.zones.DECK],
            entity => <PlayCard key={entity.id} {...entity} deck />
          )}
        </OpponentDeck>
        <OpponentMana>Mana {passivePlayer.mana} / {passivePlayer.manaCrystals}</OpponentMana>
        <OpponentHand>
          {map(
            opponentEntitiesByZone[gameConstants.zones.HAND],
            entity => <PlayCard key={entity.id} {...entity} hand back />
          )}
        </OpponentHand>
        <OpponentHero>
          {map(
            opponentEntitiesByZone[gameConstants.zones.HERO],
            entity => <HeroCard key={entity.id} {...entity} />
          )}
        </OpponentHero>
        <OpponentPlay>
          {map(
            opponentEntitiesByZone[gameConstants.zones.PLAY],
            entity => <PlayCard key={entity.id} {...entity} play />
          )}
        </OpponentPlay>
      </BoardGrid>
    )
  }
}

Board.propTypes = {
  entities: PropTypes.string
}
