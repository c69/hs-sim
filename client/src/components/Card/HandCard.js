/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/19/17.
 */
import React from 'react'
import PropTypes from 'prop-types'

import { Name, Description, Health, Attack, Cost, CardWrapper } from './CardStyled'

const HandCard = ({entity: {cost, name, text, health, attack}, ...props}) => {
  return (
    <CardWrapper {...props}>
      <Name>{name}</Name>
      <Description dangerouslySetInnerHTML={{__html: text}} />
      <Health>{health}</Health>
      <Attack>{attack}</Attack>
      {props.hand && <Cost>{cost}</Cost>}
    </CardWrapper>
  )
}

HandCard.propTypes = {
  entity: PropTypes.shape({
    cost: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,

  back: PropTypes.bool,
  hand: PropTypes.bool
}

export default HandCard
