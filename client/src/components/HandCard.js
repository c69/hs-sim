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
  border: 2px solid brown;
  
  &:hover {
    border: 2px solid lime;
  }
`

const CardBack = styled.div`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 75px;
  vertical-align: top;
  background: #5972a7;
  border: 1px solid #6e502a;
  margin: 0 10px 10px;
  box-shadow: 2px 2px 2px #6e401a;
`

const Cost = styled.span`
  position: absolute;
  top: -5px;
  left: -5px;
  padding: 5px;
  background: navy;
  color: white;
`

const Name = styled.div`
  padding: 5px;
  background: brown;
  color: white;
  text-align: center;
  text-shadow: 1px 1px 2px #000,
     -1px -1px 0 #000,  
      1px -1px 0 #000,
      -1px 1px 0 #000,
       1px 1px 0 #000;
`

const Description = styled.div`
  padding: 5px;
  background: #afafaf;
`

const HandCard = ({cost, name, description, back}) => {
  // TODO: consider moving into its own component
  if (back) {
    return (
      <CardBack />
    )
  }

  return (
    <Card>
      <Cost>{cost}</Cost>
      <Name>{name}</Name>
      <Description>{description}</Description>
    </Card>
  )
}

HandCard.propTypes = {
  cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  description: PropTypes.string,
  back: PropTypes.bool
}

export default HandCard
