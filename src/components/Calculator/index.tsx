import React, { useEffect, useState } from "react";
import Loader from "./../Loader";
import maxBy from "lodash/maxBy";
import minBy from "lodash/minBy";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import {
  CalculatorStyled,
  CalculatorInput,
  CalculatorTotal,
} from "./index.styled";
import formatCurrency from "./../../helpers/formatCurrency";

interface Props {
  stats: any;
  systemsData: any;
  currentItem: any;
  onCallback(data: any, jumps: number): void;
  loading: boolean;
}

const fetchOption: any = {
  method: "GET",
  headers: {
    accept: "application/json",
    "Accept-Language": "en-us",
  },
  mode: "cors",
  cache: "default",
};

const Calculator: React.FC<Props> = (props) => {
  const { stats, loading, onCallback, currentItem, systemsData } = props;
  const [minMaxStat, setMinMaxStat] = useState([]);
  const [jumps, setJumps] = useState(0);
  const [quantity, setQuantity] = useState(10);

  useEffect(() => {
    if (!loading) {
      const result = [];
      for (const [key, value] of Object.entries(stats)) {
        const newObject = value[currentItem.value].sell;
        newObject["place"] = find(systemsData, { value: parseInt(key) });
        result.push(newObject);
      }

      const min = minBy(result, function (o) {
        return parseFloat(o.min);
      });

      const max = maxBy(result, function (o) {
        return parseFloat(o.min);
      });
      console.log("minMax", { min, max });
      if (!isEmpty(min) && !isEmpty(max)) {
        fetch(
          "https://esi.evetech.net/latest/route/" +
            min.place.system_id +
            "/" +
            max.place.system_id +
            "/?datasource=tranquility&flag=secure",
          fetchOption
        ).then((response: any) => {
          if (response.status !== 200) {
            console.log(
              "Looks like there was a problem. Status Code: " + response.status
            );
            return;
          }
          response.json().then((data: any) => {
            setJumps(data.length);
            onCallback({ min, max }, data.length);
            setMinMaxStat({ min, max });
          });
        });
      }
    }
  }, [stats, systemsData, currentItem, loading]);

  return (
    <CalculatorStyled>
      {!isEmpty(minMaxStat) ? (
        <>
          <CalculatorInput
            onChange={(e: any) => setQuantity(parseInt(e.target.value))}
            type="number"
            value={quantity}
          />
          <CalculatorTotal>
            +
            {formatCurrency(
              minMaxStat.max.min * quantity - minMaxStat.min.min * quantity
            )}{" "}
            isk
          </CalculatorTotal>
        </>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      )}
    </CalculatorStyled>
  );
};

export default Calculator;
