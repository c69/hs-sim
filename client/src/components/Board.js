/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/18/17.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { gameActions } from '../modules'

import {
  BoardGrid,
  History,
  Deck,
  PlayerHand,
  PlayerHero,
  PlayerMana,
  PlayerPlay,
  OpponentHand,
  OpponentHero,
  OpponentMana,
  OpponentPlay
} from './BoardStyled'

// TODO: restructure - move out into Card dir and export multiple cards, TBD
import { HandCard, PlayCard, HeroCard } from './'

@connect(
  state => ({}),
  dispatch => ({
    fetchGame: () => dispatch(gameActions.fetchGame())
  })
)
export default class Board extends Component {
  componentDidMount () {
    this.props.fetchGame()
  }

  render () {
    return (
      <BoardGrid>
        {/*Extra*/}
        <History>History</History>
        <Deck>Deck</Deck>

        {/*Player*/}
        <PlayerMana>Mana 5 / 12</PlayerMana>
        <PlayerHand>
          <HandCard cost={3} name="Mishka" description="Crazy Bear" />
          <HandCard cost={1} name="Pluxa Muxa" description="Pluxa jirnaya muha" />
          <HandCard cost={7} name="Costya" description="Do whatever you want" />
        </PlayerHand>
        <PlayerHero>
          <HeroCard name="Ivan" health={28} attack={7} armor={4} power={2} />
        </PlayerHero>
        <PlayerPlay>
          <PlayCard name="Joomanji" description="Mas" attack={7} health={3} />
          <PlayCard name="Rick" description="Old man that knows something" attack={2} health={1} />
          <PlayCard name="Morty" description="A friend who wants to be a friend" attack={5} health={4} />
          <PlayCard name="Joomanji" description="Mas" attack={7} health={3} />
          <PlayCard name="Morty" description="A friend who wants to be a friend" attack={5} health={4} />
          <PlayCard name="Rick" description="Old man that knows something" attack={2} health={1} />
          <PlayCard name="Morty" description="A friend who wants to be a friend" attack={5} health={4} />
        </PlayerPlay>

        {/*Opponent*/}
        <OpponentMana>Mana 3 / 12</OpponentMana>
        <OpponentHand>
          <HandCard back />
          <HandCard back />
          <HandCard back />
        </OpponentHand>
        <OpponentHero>
          <HeroCard name="Matvey" health={13} attack={2} armor={1} power={25} />
        </OpponentHero>
        <OpponentPlay>
          <PlayCard name="Somebody" description="Unknown person" attack={5} health={2} />
          <PlayCard name="Used" description="Adjective?" attack={8} health={3} />
          <PlayCard name="To Know" description="Some description for you" attack={5} health={4} />
        </OpponentPlay>
      </BoardGrid>
    )
  }
}
