import React from 'react';
import { TabsStyled } from './Tabs.styled';

const Tabs: React.FC = (props) => {
  return <TabsStyled>{props.children}</TabsStyled>;
};

export default Tabs;
