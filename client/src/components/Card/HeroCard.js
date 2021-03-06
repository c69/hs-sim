/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/19/17.
 */
import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import { CardWrapper } from './CardStyled';

// TODO: move out
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
`;

const Health = styled.div`
  background: navy;
  color: white;
`;

const HeroCard = ({ entity: { name, health }, ...props }) => (
  <CardWrapper {...props}>
    <Name>{name}</Name>
    {/* <Attack>Attack: {attack}</Attack> */}
    {/* <Armor>Armor: {armor}</Armor> */}
    <Health>Health: {health}</Health>
    {/* <Power>Power: {power}</Power> */}
  </CardWrapper>
);

HeroCard.propTypes = {
  entity: PropTypes.shape({
    name: PropTypes.string,
    attack: PropTypes.number,
    armor: PropTypes.number,
    health: PropTypes.number,
    power: PropTypes.number,
  }).isRequired,

  back: PropTypes.bool,
  hand: PropTypes.bool,
};

HeroCard.defaultProps = {
  back: false,
  hand: false,
};

export default HeroCard;
