import React from "react";
import ItemWrapperStyled from "./index.styled";

const ItemWrapper: React.FC = (props) => {
  return <ItemWrapperStyled>{props.children}</ItemWrapperStyled>;
};

export default ItemWrapper;
