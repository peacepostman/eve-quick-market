import React, { useEffect, useState } from "react";
import maxBy from "lodash/maxBy";
import minBy from "lodash/minBy";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";

import EveOnlineAPI from "./../../model/eveOnlineApi";

import Loader from "./../Loader";
import {
  CalculatorStyled,
  CalculatorLabel,
  CalculatorInput,
  CalculatorVolume,
  CalculatorTotal,
} from "./Calculator.styled";

import formatCurrency from "./../../helpers/formatCurrency";
import getData from "./../../helpers/getData";
import setData from "./../../helpers/setData";
import toastError from "./../../helpers/toastError";

interface Props {
  stats: any;
  systemsData: any;
  currentItem: any;
  onCallback(data: any, jumps: number): void;
  loading: boolean;
}

const Calculator: React.FC<Props> = (props) => {
  const { stats, loading, onCallback, currentItem, systemsData } = props;
  const [minMaxStat, setMinMaxStat] = useState<any>([]);
  const [quantity, setQuantity] = useState<string>("10");
  const [routes, setRoutes] = useState<any>(getData("routes", true));

  useEffect(() => {
    if (!loading && systemsData.length > 1) {
      const result = [];
      for (const [key, value] of Object.entries(stats) as any) {
        if (value[currentItem.value]) {
          const newObject = value[currentItem.value];
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
        const cacheName = [min.place.system_id, max.place.system_id]
          .sort(function (a, b) {
            return a - b;
          })
          .join("_");
        if (
          !isEmpty(routes) &&
          routes[cacheName] &&
          routes[cacheName].cache_expire &&
          routes[cacheName].cache_expire > Date.now()
        ) {
          console.log({
            cached: true,min, max
          })
          onCallback({ min, max }, routes[cacheName].totalJump);
          setMinMaxStat({ min, max });
        } else {
          EveOnlineAPI.getRoute(min.place.system_id, max.place.system_id)
            .then((response: any) => {
              let routeData: any = {};

              if (!isEmpty(routes)) {
                routeData = {
                  ...routes,
                };
              }

              routeData[cacheName] = {
                totalJump: response.data.length,
                cache_expire: new Date(response.headers.expires).getTime(),
              };

              setRoutes(setData("routes", routeData, true));
              console.log({
                cached: false,min, max
              })
              onCallback({ min, max }, response.data.length);
              setMinMaxStat({ min, max });
            })
            .catch(toastError);
        }
      }
    }
  }, [loading, stats, currentItem, setMinMaxStat]);

  function onChange(e: any) {
    let input = e.target.value;
    input = input.replace(/[\D\s\._\-]+/g, "");
    input = input ? parseInt(input, 10) : 0;
    setQuantity(input === 0 ? "0" : input.toLocaleString("fr-FR"));
  }

  function getTotal() {
    const qty = parseInt(quantity.replace(/[\D\s\._\-]+/g, ""));
    return formatCurrency(minMaxStat.max.min * qty);
  }

  function getTaxes() {
    const qty = parseInt(quantity.replace(/[\D\s\._\-]+/g, ""));
    return formatCurrency(minMaxStat.max.min * qty * 0.1);
  }

  function getBenefit() {
    const qty = parseInt(quantity.replace(/[\D\s\._\-]+/g, ""));
    return formatCurrency(
      minMaxStat.max.min * qty -
        minMaxStat.min.min * qty -
        minMaxStat.max.min * qty * 0.1
    );
  }

  function getVolume() {
    const qty = parseInt(quantity.replace(/[\D\s\._\-]+/g, ""));
    return formatCurrency(currentItem.packaged_volume * qty);
  }

  function onKeyDown(e: any) {
    const { keyCode } = e;
    let currentValue: any = quantity;
    currentValue = currentValue.replace(/[\D\s\._\-]+/g, "");
    currentValue = currentValue ? parseInt(currentValue, 10) : 0;

    if (keyCode === 38) {
      setQuantity((currentValue + 1).toLocaleString("fr-FR"));
    } else if (keyCode === 40 && currentValue !== 0) {
      setQuantity((currentValue - 1).toLocaleString("fr-FR"));
    }
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
          <div>
            <CalculatorLabel>Quantity</CalculatorLabel>
            <CalculatorInput
              onChange={onChange}
              onKeyDown={onKeyDown}
              type="text"
              value={quantity}
            />
            <CalculatorVolume>{getVolume()}m3 packaged</CalculatorVolume>
          </div>

          {!isEmpty(minMaxStat) ? (
            <CalculatorTotal>
              <ul>
                <li>
                  <span>Total:</span> {getTotal()} isk
                </li>
                <li>
                  <span title="Taxes are set on 10%">Taxes:</span> -{getTaxes()}{" "}
                  isk
                </li>
                <li>
                  <span>Benefit:</span> +{getBenefit()} isk
                </li>
              </ul>
            </CalculatorTotal>
          ) : null}
        </>
      )}
    </CalculatorStyled>
  );
};

export default Calculator;
