/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/19/17.
 */
import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'

// TODO: move out to styled comps
const Card = styled.div`
  position: relative;
  display: inline-block;
  width: 75px;
  height: 100px;
  margin: 0 5px 10px;
  vertical-align: top;
  border: 10px solid #888F98;
  background: #b1bac6;
  border-radius: 20px;

  &:hover {
    border: 10px solid #37d731;
  }
`

const Name = styled.div`
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
  background: #74160f;
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
  background: #b98822;
  color: white;
  text-shadow: 1px 1px 2px #000,
     -1px -1px 0 #000,  
      1px -1px 0 #000,
      -1px 1px 0 #000,
       1px 1px 0 #000;
`

const PlayCard = ({name, description, health, attack}) => {
  return (
    <Card onClick={() => {
      alert(`Data: ${JSON.stringify({name, description, health, attack})}`)
    }}>
      <Name>{name}</Name>
      <Description>{description}</Description>
      <Health>{health}</Health>
      <Attack>{attack}</Attack>
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
