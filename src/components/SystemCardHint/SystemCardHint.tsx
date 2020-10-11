import React, { useEffect, useState } from "react";
import find from "lodash/find";
import SystemCardHintStyled from "./SystemCardHint.styled";
import formatCurrency from "./../../helpers/formatCurrency";

interface Props {
  systemsRef: any;
  minMax: any;
  jumps: number;
}

const SystemCardHint: React.FC<Props> = (props) => {
  const { systemsRef, minMax, jumps } = props;
  const [hintStyle, setHintStyle] = useState({});
  const [direction, setDirection] = useState<"left" | "right">("left");

  useEffect(() => {
    getRouteHint();
  }, [minMax]);

  function getRouteHint() {
    if (systemsRef && systemsRef.current.length > 1) {
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
        const scrollLeft = lowest.parentElement.scrollLeft;
        setDirection(highestPos.left > lowestPos.left ? "left" : "right");
        setHintStyle({
          left: minLeft + highestPos.width / 2 + scrollLeft,
          width:
            maxLeft + highestPos.width / 2 - (minLeft + highestPos.width / 2),
        });
      } else {
        setHintStyle({});
      }
    }
  }

  return jumps && systemsRef && systemsRef.current.length > 1 ? (
    <SystemCardHintStyled style={hintStyle} direction={direction}>
      <div className="infos">
        <span className="percent">
          +
          {formatCurrency(
            Number((minMax.max.min - minMax.min.min) / minMax.min.min) * 100
          )}
          %
        </span>
        {jumps} jumps
      </div>
    </SystemCardHintStyled>
  ) : null;
};

export default SystemCardHint;
