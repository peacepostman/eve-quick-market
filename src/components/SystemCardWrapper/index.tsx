import React from "react";
import SystemCardStyled from "./index.styled";

const SystemCard: React.FC = (props) => {
  return <SystemCardStyled>{props.children}</SystemCardStyled>;
};

export default SystemCard;
