import React from 'react';
import { TabPanelStyled } from './Tabs.styled';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isActive: boolean;
}

const TabPanel: React.FC<Props> = (props: Props) => {
  const { isActive } = props;
  return <TabPanelStyled isActive={isActive}>{props.children}</TabPanelStyled>;
};

export default TabPanel;
