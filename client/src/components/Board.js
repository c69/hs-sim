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
import { Card, HandCard, PlayCard, HeroCard, Position, EndTurnButton } from './'

@connect(
  state => ({
    endTurnActionIndex: gameSelectors.gameActionEndTurn(state),
    game: gameSelectors.gameSelector(state),
    selected: gameSelectors.selectedSelector(state),
    targets: gameSelectors.targetsSelector(state),
    positions: gameSelectors.positionsSelector(state),
    activePlayer: gameSelectors.activePlayerSelector(state),
    passivePlayer: gameSelectors.passivePlayerSelector(state)
  }),
  dispatch => ({
    selectPosition: params => dispatch(gameActions.selectPosition(params)),
    fetchGame: params => dispatch(gameActions.fetchGame(params)),
    selectCard: params => dispatch(gameActions.selectCard(params)),
    endTurn: params => dispatch(gameActions.endTurn(params))
  })
)
export default class Board extends Component {
  static propTypes = {
    endTurn: PropTypes.func.isRequired,
    fetchGame: PropTypes.func.isRequired,
    selectCard: PropTypes.func.isRequired,
    selectPosition: PropTypes.func.isRequired,
    endTurnActionIndex: PropTypes.number,
    activePlayer: PropTypes.object,
    passivePlayer: PropTypes.object,
    targets: PropTypes.object,
    positions: PropTypes.array,
    game: PropTypes.object,
    selected: PropTypes.object.isRequired
  }

  componentDidMount () {
    this.props.fetchGame()
  }

  render () {
    const {turn} = this.props.game
    const {
      activePlayer: {zones: activePlayerZones, mana: activePlayerMana, manaCrystals: activePlayerManaCrystals},
      passivePlayer: {zones: passivePlayerZones, mana: passivePlayerMana, manaCrystals: passivePlayerManaCrystals},
      endTurnActionIndex, selectCard, selected, positions, targets
    } = this.props
    const cardProps = {selectCard, targets}

    // TODO: update this with more graceful loading process i.e. FETCH_GAME_LOADING selector
    if (!activePlayerZones || !passivePlayerZones) {
      return <div>Loading</div>
    }

    return (
      <BoardGrid>
        {/*Extra*/}
        <History>History<br />Turn {turn}</History>
        <EndTurn>
          {
            (endTurnActionIndex !== -1)
            && <EndTurnButton
              available={endTurnActionIndex !== -1}
              onClick={() => this.props.endTurn({optionIndex: endTurnActionIndex})}>End Turn</EndTurnButton>
          }
          <button onClick={() => this.props.endTurn({optionIndex: 0})}>Whatever First Action</button>
        </EndTurn>

        {/*Player*/}
        <PlayerDeck>
          {map(
            activePlayerZones[gameConstants.zones.DECK],
            entity => <Card deck key={entity.id + entity.card_id} entity={entity} {...cardProps} />
          )}
        </PlayerDeck>
        <PlayerMana>Mana {activePlayerMana} / {activePlayerManaCrystals}</PlayerMana>
        <PlayerHand>
          {map(
            activePlayerZones[gameConstants.zones.HAND],
            entity => <Card hand key={entity.id + entity.card_id} entity={entity} {...cardProps} />
          )}
        </PlayerHand>
        <PlayerHero>
          {map(
            activePlayerZones[gameConstants.zones.HERO],
            entity => <Card hero key={entity.id + entity.card_id} entity={entity} {...cardProps} />
          )}
        </PlayerHero>
        <PlayerPlay>
          <Position selectPosition={this.props.selectPosition} positions={positions} />
          {map(
            activePlayerZones[gameConstants.zones.PLAY],
            entity => <Card play key={entity.id + entity.card_id} entity={entity} {...cardProps} />
          )}
        </PlayerPlay>

        {/*Opponent*/}
        <OpponentDeck>
          {map(
            passivePlayerZones[gameConstants.zones.DECK],
            entity => <Card deck key={entity.id + entity.card_id} entity={entity} {...cardProps} />
          )}
        </OpponentDeck>
        <OpponentMana>Mana {passivePlayerMana} / {passivePlayerManaCrystals}</OpponentMana>
        <OpponentHand>
          {map(
            passivePlayerZones[gameConstants.zones.HAND],
            entity => <Card hand back key={entity.id + entity.card_id} entity={entity} {...cardProps} />
          )}
        </OpponentHand>
        <OpponentHero>
          {map(
            passivePlayerZones[gameConstants.zones.HERO],
            entity => <Card hero key={entity.id + entity.card_id} entity={entity} {...cardProps} />
          )}
        </OpponentHero>
        <OpponentPlay>
          {map(
            passivePlayerZones[gameConstants.zones.PLAY],
            entity => <Card play key={entity.id + entity.card_id} entity={entity} {...cardProps} />
          )}
        </OpponentPlay>
      </BoardGrid>
    )
  }
}
