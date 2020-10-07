import React from "react";
import SystemCardWrapperStyled from "./index.styled";

const SystemCardWrapper: React.FC = (props) => {
  return <SystemCardWrapperStyled>{props.children}</SystemCardWrapperStyled>;
};

export default SystemCardWrapper;
