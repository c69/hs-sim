/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/19/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { ifProp } from 'styled-tools'

import styled from 'styled-components'

const Name = styled.div`
  position: relative;
  padding: 5px;
  background: brown;
  color: white;
  text-shadow: 1px 1px 1px black;
  text-align: center;
`

const Description = styled.div`
  font-size: smaller;
  padding: 5px;
  background: #afafaf;
`

const Health = styled.div`
  position: absolute;
  bottom: -5px;
  right: -5px;
  padding: 5px;
  opacity: 0.5;
  background: #74160f;
  color: white;
  text-shadow: 1px 1px 2px #000,
     -1px -1px 0 #000,  
      1px -1px 0 #000,
      -1px 1px 0 #000,
       1px 1px 0 #000;
`

const Cost = styled.div`
  position: absolute;
  top: -5px;
  left: -5px;
  padding: 5px;
  opacity: 0.5;
  background: #2044aa;
  color: white;
  text-shadow: 1px 1px 2px #000,
     -1px -1px 0 #000,  
      1px -1px 0 #000,
      -1px 1px 0 #000,
       1px 1px 0 #000;
`

const Attack = styled.div`
  position: absolute;
  bottom: -5px;
  left: -5px;
  padding: 5px;
  opacity: 0.5;
  background: #b98822;
  color: white;
  text-shadow: 1px 1px 2px #000,
     -1px -1px 0 #000,  
      1px -1px 0 #000,
      -1px 1px 0 #000,
       1px 1px 0 #000;
`

const Card = styled.div`
  position: relative;
  display: inline-block;
  width: 75px;
  height: 100px;
  margin: 0 2px ${ifProp('deck', '-50px', '10px')};
  vertical-align: top;
  border: 5px solid #888F98;
  background: #b1bac6;
  border-radius: 10px;

  font-face: 'Gill Sans', sans;
  font-size: 12px;

  &:hover {
    border: 5px solid #37d731;
    overflow: visible;
    z-index: 10;
  }

  &:hover ${Health}, &:hover ${Attack}, &:hover ${Cost} {
    opacity: 1;
  }
`

const PlayCard = ({name, text, health, attack, cost, ...props}) => {
  return (
    <Card {...props} onClick={() => {
      alert(`Data: ${JSON.stringify({name, text, health, attack})}`)
    }}>
      <Name>{name}</Name>
      <Description dangerouslySetInnerHTML={{__html: text}} />
      {props.play && <Health>{health}</Health>}
      {props.play && <Attack>{attack}</Attack>}
      {props.hand && <Cost>{cost}</Cost>}
    </Card>
  )
}

PlayCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  health: PropTypes.number,
  attack: PropTypes.number
}

export default PlayCard
