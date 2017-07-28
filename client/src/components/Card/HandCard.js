/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/19/17.
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Name, Description, Health, Attack, Cost, CardWrapper } from './CardStyled';

const HandCard = ({
  entity: {
    card_id,
    name, 
    text,
    cost, 
    health, 
    attack 
  },
  ...props
}) => (
  <CardWrapper {...props}>
    <Name>{name} #{card_id}</Name>
    <Description dangerouslySetInnerHTML={{ __html: text }} />
    <Health>{health}</Health>
    <Attack>{attack}</Attack>
    {props.hand && <Cost>{cost}</Cost>}
  </CardWrapper>
);

HandCard.propTypes = {
  entity: PropTypes.shape({
    cost: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,

  back: PropTypes.bool,
  hand: PropTypes.bool,
};

HandCard.defaultProps = {
  back: false,
  hand: false,
};

export default HandCard;
