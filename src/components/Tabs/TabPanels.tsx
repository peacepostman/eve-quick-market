import React from 'react';
import { TabPanelsStyled } from './Tabs.styled';

const TabPanels: React.FC = (props) => {
  return <TabPanelsStyled>{props.children}</TabPanelsStyled>;
};

export default TabPanels;
