/**
 * Created by Roman Morozov <sublimeye.ua@gmail.com> on 7/25/17.
 */
import styled, { css } from 'styled-components';
import { ifProp } from 'styled-tools';

export const Cost = styled.span`
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
`;

export const Health = styled.div`
  position: absolute;
  bottom: -5px;
  right: -5px;
  padding: 3px;
  opacity: 0.5;
  border-radius: 50%;
  font-weight: bold;
  font-size: 16px;
  background: #74160f;
  color: white;
  text-shadow: 1px 1px 2px #000,
     -1px -1px 0 #000,  
      1px -1px 0 #000,
      -1px 1px 0 #000,
       1px 1px 0 #000;
`;

export const Attack = styled.div`
  position: absolute;
  bottom: -5px;
  left: -5px;
  padding: 3px;
  opacity: 0.5;
  border-radius: 50%;
  font-weight: bold;
  font-size: 16px;
  background: #b98822;
  color: white;
  text-shadow: 1px 1px 2px #000,
     -1px -1px 0 #000,  
      1px -1px 0 #000,
      -1px 1px 0 #000,
       1px 1px 0 #000;
`;

export const Name = styled.div`
  position: relative;
  padding: 5px;
  background: brown;
  color: white;
  text-align: center;
  text-shadow: 1px 1px 2px #000,
     -1px -1px 0 #000,  
      1px -1px 0 #000,
      -1px 1px 0 #000,
       1px 1px 0 #000;
`;

export const CardBack = styled.div`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 75px;
  vertical-align: top;
  background: #5972a7;
  border: 1px solid #6e502a;
  margin: 0 10px ${ifProp('deck', '-55px', '10px')};
  box-shadow: 2px 2px 2px #6e401a;
`;

export const Description = styled.div`
  font-size: smaller;
  padding: 5px;
  background: #afafaf;
`;

export const CardWrapper = styled.div`
  margin: 0 2px ${ifProp('deck', '-85px', '10px')};
`;

export const Card = styled.div`
  position: relative;
  display: inline-block;
  width: 75px;
  height: 100px;
  margin: 0 2px 10px;
  vertical-align: top;
  text-align: center;
  border: 5px solid #888F98;
  background: #b1bac6;
  border-radius: 10px;

  font-face: 'Gill Sans', sans;
  font-size: 12px;
  
  ${ifProp('available', css`
    cursor: pointer;
    border: 5px solid #37d731;
    overflow: visible;
    z-index: 10;
  `)};

  ${ifProp('target', css`
    cursor: pointer;
    border: 5px solid red;
    overflow: visible;
    z-index: 10;
  `)};

  &:hover ${Health}, &:hover ${Attack}, &:hover ${Cost} {
    opacity: 1;
  }
`;
