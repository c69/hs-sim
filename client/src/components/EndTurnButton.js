/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/19/17.
 */
import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { ifProp } from 'styled-tools'

const EndTurn = styled.button`
  border: 3px solid grey;
  ${ifProp('available', css`
    cursor: pointer;
    border-color: #37d731;
  `)}
`

const EndTurnButton = ({available, onClick}) => {
  return (
    <EndTurn onClick={onClick} available={available}>End Turn</EndTurn>
  )
}

EndTurnButton.propTypes = {
  available: PropTypes.bool.isRequired
}

export default EndTurnButton
