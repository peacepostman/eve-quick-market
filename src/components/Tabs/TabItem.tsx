import React from 'react';
import { TabItemStyled } from './Tabs.styled';

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
}

const TabItem: React.FC<Props> = (props: Props) => {
  const { isActive, children, ...otherProps } = props;
  return (
    <TabItemStyled isActive={isActive} {...otherProps}>
      {children}
    </TabItemStyled>
  );
};

export default TabItem;
