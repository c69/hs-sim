/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/18/17.
 */
import styled from 'styled-components'

export const BoardGrid = styled.div`
  display: grid;
  grid-template-rows: 75px 125px minmax(50px, 1fr) minmax(50px, 1fr) 125px 75px;
  grid-template-columns: 50px 100px minmax(300px, 1fr) 100px 1fr;
  background: #efefef;

  & div {
    outline: 1px solid rgba(255, 0, 0, 0.2);
  }
`

export const PlayerHand = styled.div`
  grid-row: 6;
  grid-column: 2 / 4;
  justify-self: center;
`

export const PlayerHero = styled.div`
  grid-row: 5;
  grid-column: 3 / 4;
  justify-self: center;
`

export const PlayerMana = styled.div`
  grid-row: 6;
  grid-column: 4;
`

export const PlayerPlay = styled.div`
  grid-row: 4;
  grid-column: 2 / 5;
  justify-self: center;
`

export const PlayerDeck = styled.div`
  grid-row: 4 / 7;
  grid-column: 5;
  background: #a3aab4;
`

export const OpponentHand = styled.div`
  grid-row: 1;
  grid-column: 2 / 4;
  justify-self: center;
`

export const OpponentHero = styled.div`
  grid-row: 2;
  grid-column: 3 / 4;
  justify-self: center;
`

export const OpponentMana = styled.div`
  grid-row: 1;
  grid-column: 4;
`

export const OpponentPlay = styled.div`
  grid-row: 3;
  grid-column: 2 / 5;
  justify-self: center;
`

export const OpponentDeck = styled.div`
  grid-row: 1 / 4;
  grid-column: 5;
  background: #a3aab4;
`

export const EndTurn = styled.div`
  grid-row: 6;
  grid-column: 1;
`

export const History = styled.div`
  grid-row: 1 / 7;
  grid-column: 1;
  background: #a3aab4;
  align-self: center;
  writing-mode: vertical-lr;
`
