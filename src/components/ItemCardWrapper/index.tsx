import React from "react";
import ItemCardWrapperStyled from "./index.styled";

const ItemCardWrapper: React.FC = (props) => {
  return <ItemCardWrapperStyled>{props.children}</ItemCardWrapperStyled>;
};

export default ItemCardWrapper;
