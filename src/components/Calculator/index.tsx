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
  const [minMaxStat, setMinMaxStat] = useState<any>([]);
  const [quantity, setQuantity] = useState<string>("10");

  useEffect(() => {
    if (!loading && systemsData.length > 1) {
      const result = [];
      for (const [key, value] of Object.entries(stats) as any) {
        if (value[currentItem.value]) {
          const newObject = value[currentItem.value].sell;
          newObject["place"] = find(systemsData, { value: parseInt(key) });
          result.push(newObject);
        }
      }

      const min = minBy(result, function (o) {
        return parseFloat(o.min);
      });

      const max = maxBy(result, function (o) {
        return parseFloat(o.min);
      });
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
            onCallback({ min, max }, data.length);
            setMinMaxStat({ min, max });
          });
        });
      }
    }
  }, [loading, currentItem, setMinMaxStat]);

  function onChange(e: any) {
    let input = e.target.value;
    input = input.replace(/[\D\s\._\-]+/g, "");
    input = input ? parseInt(input, 10) : 0;
    setQuantity(input === 0 ? "0" : input.toLocaleString("en-US"));
  }

  function getTotal() {
    const qty = parseInt(quantity.replace(",", ""));
    return formatCurrency(minMaxStat.max.min * qty - minMaxStat.min.min * qty);
  }

  return (
    <CalculatorStyled>
      {loading ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader color="#fff" />
        </div>
      ) : (
        <>
          <CalculatorInput onChange={onChange} type="text" value={quantity} />
          {!isEmpty(minMaxStat) ? (
            <CalculatorTotal>+{getTotal()} isk</CalculatorTotal>
          ) : null}
        </>
      )}
    </CalculatorStyled>
  );
};

export default Calculator;
