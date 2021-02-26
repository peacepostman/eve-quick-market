import React from 'react';
import { NavStyled } from './Nav.styled';

const Nav: React.FC = (props) => {
  return <NavStyled>{props.children}</NavStyled>;
};

export default Nav;
