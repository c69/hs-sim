/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/19/17.
 */
import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'

// TODO: move out
const Card = styled.div`
  position: relative;
  display: inline-block;
  width: 75px;
  height: 100px;
  vertical-align: top;
  margin: 0 10px 10px;
  border: 1px solid brown;
`

const Name = styled.div`
  padding: 5px;
  background: #75e4f6;
  color: white;
  text-align: center;
  text-shadow: 1px 1px 2px #000,
     -1px -1px 0 #000,  
      1px -1px 0 #000,
      -1px 1px 0 #000,
       1px 1px 0 #000;
`

const Attack = styled.div`
  background: navy;
  color: white;
`
const Armor = styled.div`
  background: navy;
  color: white;
`
const Health = styled.div`
  background: navy;
  color: white;
`
const Power = styled.div`
  background: navy;
  color: white;
`

const HeroCard = ({name, attack, armor, health, power,}) => {
  return (
    <Card>
      <Name>{name}</Name>

      <Attack>Attack: {attack}</Attack>
      <Armor>Armor: {armor}</Armor>
      <Health>Health: {health}</Health>
      <Power>Power: {power}</Power>
    </Card>
  )
}

HeroCard.propTypes = {
  name: PropTypes.string,
  attack: PropTypes.number,
  armor: PropTypes.number,
  health: PropTypes.number,
  power: PropTypes.number // spell?
}

export default HeroCard
