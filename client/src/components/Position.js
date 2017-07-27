/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/19/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { ifProp } from 'styled-tools'

const PositionWrapper = styled.div`
  display: inline-block;
  width: 75px;
  height: 100px;
  border-radius: 10px;
  background-image: repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.5) 35px, rgba(255,255,255,.5) 70px);
  ${ifProp('available', css`
    background: #37d731;
    opacity: 0.8;
  `)}
`

const Position = ({positions, selectPosition}) => {
  const hardcodedFirstPosition = 0

  const available = positions && positions.length && positions.includes(hardcodedFirstPosition)
  return (
    <PositionWrapper onClick={available && (() => selectPosition(hardcodedFirstPosition))} available={available}>Position</PositionWrapper>
  )
}

Position.propTypes = {
  positions: PropTypes.array
}

export default Position
