import React from "react";
import MainWrapperStyled from "./MainWrapper.styled";

const MainWrapper: React.FC = (props) => {
  return <MainWrapperStyled>{props.children}</MainWrapperStyled>;
};

export default MainWrapper;
