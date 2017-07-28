/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/19/17.
 */
import React from 'react';
import PropTypes from 'prop-types';

import { Name, Description, Health, Attack, Cost, CardWrapper } from './CardStyled';

const PlayCard = ({ entity: { name, text, health, attack, cost } }, ...props) => (
  <CardWrapper {...props}>
    <Name>{name}</Name>
    <Description dangerouslySetInnerHTML={{ __html: text }} />
    <Health>{health}</Health>
    <Attack>{attack}</Attack>
    {props.hand && <Cost>{cost}</Cost>}
  </CardWrapper>
);

PlayCard.propTypes = {
  entity: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    health: PropTypes.number,
    attack: PropTypes.number,
  }).isRequired,

  hand: PropTypes.bool,
};

PlayCard.defaultProps = {
  hand: false,
};

export default PlayCard;
