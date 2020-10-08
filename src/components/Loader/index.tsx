import React from "react";
import LoaderStyled from "./index.styled";

const Loader = (props: { size: string; color: string }) => {
  const { size, color } = props;
  return <LoaderStyled size={size} color={color} />;
};

Loader.defaultProps = {
  size: "42px",
  color: "#333",
};

export default Loader;
