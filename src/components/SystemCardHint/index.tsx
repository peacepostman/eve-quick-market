import React, { useEffect, useState } from "react";
import find from "lodash/find";
import SystemCardHintStyled from "./index.styled";

interface Props {
  systemsRef: any;
  minMax: any;
  jumps: number;
}

const SystemCardHint: React.FC<Props> = (props) => {
  const { systemsRef, minMax, jumps } = props;
  const [hintStyle, setHintStyle] = useState({});
  const [direction, setDirection] = useState("left");

  useEffect(() => {
    getRouteHint();
  }, [minMax]);

  function getRouteHint() {
    if (systemsRef && systemsRef.current.length > 0) {
      const lowest = find(systemsRef.current, (element: any) => {
        return element.dataset.lowest === "true";
      });

      const highest = find(systemsRef.current, (element: any) => {
        return element.dataset.highest === "true";
      });

      if (lowest && highest) {
        const lowestPos = lowest.getBoundingClientRect();
        const highestPos = highest.getBoundingClientRect();
        const minLeft = Math.min(lowestPos.left, highestPos.left);
        const maxLeft = Math.max(lowestPos.left, highestPos.left);
        setDirection(highestPos.left > lowestPos.left ? "left" : "right");
        setHintStyle({
          left: minLeft + highestPos.width / 2,
          width:
            maxLeft + highestPos.width / 2 - (minLeft + highestPos.width / 2),
        });
      } else {
        setHintStyle({});
      }
    }
  }

  return (
    <SystemCardHintStyled style={hintStyle} direction={direction}>
      <div className="jumps">{jumps} jumps</div>
    </SystemCardHintStyled>
  );
};

export default SystemCardHint;
