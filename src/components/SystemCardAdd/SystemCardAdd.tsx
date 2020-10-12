import React, { useState, useEffect } from "react";
import SystemCard from "./../SystemCard";
import StationSearch from "./../StationSearch";
import SystemCardAddStyled from "./SystemCardAdd.styled";

interface Props {
  onClick(info: any): void;
}

const SystemCardAdd: React.FC<Props> = (props) => {
  const { onClick } = props;
  const [data, setData] = useState({});
  const [reset, setReset] = useState(false);

  useEffect(() => {
    if (reset) {
      setTimeout(() => setReset(false), 200);
    }
  }, [reset]);

  function onAdd(e: any) {
    e.preventDefault();
    onClick(data);
    setReset(true);
  }

  return (
    <SystemCard>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          flex: 1,
          flexDirection: "column",
        }}
      >
        <StationSearch onChangeCallback={setData} reset={reset} />
        <SystemCardAddStyled onClick={onAdd}>Add</SystemCardAddStyled>
      </div>
    </SystemCard>
  );
};

export default SystemCardAdd;
