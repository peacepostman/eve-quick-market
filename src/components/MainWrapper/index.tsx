import React from "react";
import MainWrapperStyled from "./index.styled";

const MainWrapper: React.FC = (props) => {
  return <MainWrapperStyled>{props.children}</MainWrapperStyled>;
};

export default MainWrapper;
