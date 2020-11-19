import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";

import axios from "axios";
import minBy from "lodash/minBy";
import maxBy from "lodash/maxBy";
import max from "lodash/max";
import meanBy from "lodash/meanBy";
import compact from "lodash/compact";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import filter from "lodash/filter";
import take from "lodash/take";
import find from "lodash/find";
import reverse from "lodash/reverse";
import includes from "lodash/includes";
import Loader from "./../Loader";
import EveOnlineAPI from "./../../model/eveOnlineApi";

import CountDown from "./../CountDown";
import formatCurrency from "./../../helpers/formatCurrency";
import getData from "./../../helpers/getData";
import setData from "./../../helpers/setData";
import {
  WatchListStyled,
  WatchListHeaderStyled,
  WatchListReload,
} from "./WatchList.styled";

interface Props {
  station: any;
  addToItems(item: any): void;
}

const WatchList = (props: Props) => {
  const { station, addToItems } = props;
  const [loadingWatched, setLoadingWatched] = useState<boolean>(false);
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [canRefresh, setCanRefresh] = useState<boolean>(false);
  const [rawItems, setRawItems] = useState<any>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  const hasStoredItems = getData("anomalies_" + station.value);
  const [watchedItems, setWatchedItems] = useState<any[]>(
    hasStoredItems && hasStoredItems.length > 0 ? hasStoredItems : null
  );

  const hasStoredDate = getData("anomalies_expire_" + station.value);
  const [refreshDate, setRefreshDate] = useState<any>(
    hasStoredDate ? Number(hasStoredDate[0]) : null
  );

  const [refreshTimeArray, setRefreshTimeArray] = useState<any>([]);
  const [initialEndDate, setInitialEndDate] = useState<any>();
  const [percentLeft, setPercentLeft] = useState(100);

  const [strictMode, setStrictMode] = useState(false);
  const [orderByDifference, setOrderByDifference] = useState<any>(null);

  const regionID = station.region_id;
  const stationID = station.value;

  // sell order quantity * sell order price
  const MINIMUM_TOTAL_SELL_AMOUNT = 500000;
  // gap in percent between first sell order and second sell order
  const GAP_BETWEEN_TWO_FIRST_SELLS_ORDERS = 10;
  // gap in percent between first sell order and first buy order
  const GAP_BETWEEN_SELL_ORDER_AND_BUY_ORDER = 5;

  useEffect(() => {
    if (
      !watchedItems ||
      (watchedItems && refreshDate && refreshDate < Date.now())
    ) {
      setCanRefresh(false);
      getMarketOrders();
    } else {
      setInitialEndDate(refreshDate - Date.now());
    }
  }, []);

  useEffect(() => {
    if (isFetched) {
      processData();
    }
  }, [isFetched]);

  useEffect(() => {
    if (filteredItems.length > 0) {
      finalProcess();
    }
  }, [filteredItems]);

  const getMarketOrders = (page: number = 1) => {
    setLoadingWatched(true);
    EveOnlineAPI.getMarketOrder(regionID, "", "all", page.toString())
      .then((orders: any) => {
        setRawItems((prev: any) => prev.concat(orders.data));
        setRefreshTimeArray((prev: any) =>
          prev.concat(new Date(orders.headers.expires).getTime())
        );
        if (parseInt(orders.headers["x-pages"]) > page) {
          getMarketOrders(page + 1);
        } else {
          setIsFetched(true);
        }
      })
      .catch((error: any) => {
        console.log("getMarketOrder::error", error);
      });
  };

  const finalProcess = useCallback(() => {
    axios
      .all(
        filteredItems.map((item: any) =>
          EveOnlineAPI.getMarketHistory(regionID, item.sell.type_id.toString())
            .then((history: any) => {
              const historyDataCompact = take(reverse(history.data), 7);
              return {
                median: {
                  price_average: meanBy(historyDataCompact, "average"),
                  order_count_average: meanBy(
                    historyDataCompact,
                    "order_count"
                  ),
                  volume_average: meanBy(historyDataCompact, "volume"),
                },
                ...item,
              };
            })
            .catch((error: any) => {
              console.log("getMarketHistory::error", error);
            })
        )
      )
      .then(
        axios.spread((...final) => {
          const filtered = compact(final);
          const finalArray: any[] = [];
          filtered.map((item) => {
            if (item.sell.price < item.median.price_average) {
              finalArray.push(item);
            }
          });

          axios
            .all(
              finalArray.map((item: any) =>
                EveOnlineAPI.getItem(item.sell.type_id.toString())
                  .then((itemInfo: any) => {
                    return {
                      type_id: itemInfo.data.type_id,
                      value: itemInfo.data.type_id,
                      label: itemInfo.data.name,
                      image_type: itemInfo.data.name
                        .toLowerCase()
                        .includes("blueprint")
                        ? "bp"
                        : !itemInfo.data.icon_id
                        ? itemInfo.data.graphic_id
                          ? "render"
                          : null
                        : "icon",
                      volume: itemInfo.data.volume,
                      packaged_volume: itemInfo.data.packaged_volume,
                      description: itemInfo.data.description,
                    };
                  })
                  .catch((error: any) => {
                    console.log("getItem::error", error);
                  })
              )
            )
            .then(
              axios.spread((...infos) => {
                const final = finalArray.map((item: any, index: number) => {
                  return {
                    ...item,
                    infos: find(infos, { type_id: item.sell.type_id }),
                  };
                });
                setData("anomalies_" + station.value, final);
                setWatchedItems(final);
                setLoadingWatched(false);
              })
            )
            .catch((error: any) => {
              console.log("getItems::error", error);
            });
        })
      )
      .catch((error: any) => {
        console.log("getMarketHistories::error", error);
      });
  }, [filteredItems]);

  const processData = useCallback(() => {
    const groupedBy: any = groupBy(
      filter(compact(rawItems), { location_id: stationID }),
      "type_id"
    );
    const filteredOrders: any = [];
    for (const [key, value] of Object.entries(groupedBy)) {
      // @ts-ignore
      const buyOrders = filter(value, { is_buy_order: true });
      // @ts-ignore
      const sellOrders: any = orderBy(
        // @ts-ignore
        filter(value, { is_buy_order: false }),
        ["price"],
        ["asc"]
      );
      if (buyOrders.length > 0 && sellOrders.length > 1) {
        const minSellOrder: any = minBy(sellOrders, "price");
        const maxBuyOrder: any = maxBy(buyOrders, "price");

        if (
          minSellOrder &&
          maxBuyOrder &&
          minSellOrder.price * minSellOrder.volume_remain >=
            MINIMUM_TOTAL_SELL_AMOUNT
        ) {
          const pricePercentageDifferenceWithSecondOrder =
            100 *
            Math.abs(
              (sellOrders[1].price - minSellOrder.price) /
                ((sellOrders[1].price + minSellOrder.price) / 2)
            );
          if (
            pricePercentageDifferenceWithSecondOrder >
            GAP_BETWEEN_TWO_FIRST_SELLS_ORDERS
          ) {
            filteredOrders.push({
              sell: minSellOrder,
              second_sell: sellOrders[1],
              difference_with_second_sell_order: pricePercentageDifferenceWithSecondOrder,
              strict_anomaly:
                minSellOrder.price <
                maxBuyOrder.price *
                  ((100 + GAP_BETWEEN_SELL_ORDER_AND_BUY_ORDER) / 100),
              buy: maxBuyOrder,
            });
          }
        }
      }
    }
    setFilteredItems(filteredOrders);
    const refreshDate: any = max(refreshTimeArray);
    setData("anomalies_expire_" + station.value, refreshDate);
    setInitialEndDate(refreshDate - Date.now());
    setRefreshDate(refreshDate);
  }, [rawItems, refreshTimeArray]);

  function addToMyItems(e: any, item: any) {
    e.preventDefault();
    addToItems(item);
    toast.success("Successfully added to items list", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  function reload(e: any) {
    e.preventDefault();

    setCanRefresh(false);
    setLoadingWatched(true);
    setRawItems([]);
    setFilteredItems([]);
    setWatchedItems([]);
    getMarketOrders();
  }

  const onCountdownTick = useCallback(
    (infos: any) => {
      const percent = (100 * infos.total) / initialEndDate;
      setPercentLeft(percent);
    },
    [initialEndDate]
  );

  function changeStrictMode(e: any) {
    setStrictMode(!strictMode);
  }

  function sortByDifference(e: any) {
    e.preventDefault();
    setOrderByDifference((prev: any) =>
      !prev || prev === "desc" ? "asc" : "desc"
    );
  }

  useEffect(() => {
    if (orderByDifference) {
      setWatchedItems((prev) =>
        orderBy(
          prev,
          ["difference_with_second_sell_order"],
          [orderByDifference]
        )
      );
    }
  }, [orderByDifference]);

  return (
    <WatchListStyled>
      <WatchListHeaderStyled>
        <h1>Orders anomalies at {station.label}</h1>
        {!loadingWatched && initialEndDate ? (
          <WatchListReload onClick={reload} disabled={!canRefresh}>
            <CircularProgressbarWithChildren
              value={percentLeft}
              styles={buildStyles({
                strokeLinecap: "butt",
                pathColor: !canRefresh ? "#fbb438" : "#72d363",
                trailColor: "#192c34",
              })}
            >
              {canRefresh ? (
                <img
                  src="img/reload.svg"
                  style={{ width: "30px", height: "30px", marginTop: "-12px" }}
                />
              ) : (
                <CountDown
                  expire={refreshDate}
                  onTick={onCountdownTick}
                  onComplete={() => {
                    setCanRefresh(true);
                  }}
                />
              )}
            </CircularProgressbarWithChildren>
          </WatchListReload>
        ) : null}
        <label htmlFor="strict_only">
          <input
            checked={strictMode}
            type="checkbox"
            name="strict_only"
            id="strict_only"
            onChange={changeStrictMode}
          />
          Show only wrong sell orders
        </label>
      </WatchListHeaderStyled>
      {loadingWatched ? (
        <div style={{ margin: "60px 0" }}>
          <Loader color={"#fff"} />
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Total available</th>
              <th>sell order price</th>
              <th>second sell order price</th>
              <th>
                <a href="" onClick={sortByDifference}>
                  Difference
                </a>
              </th>
              <th>buy order price</th>
              <th>average price 7 days</th>
              <th>average order count 7 days</th>
              <th>average volume 7 days</th>
            </tr>
          </thead>
          <tbody>
            {watchedItems && watchedItems.length > 0 ? (
              watchedItems
                .filter((item) =>
                  strictMode ? item.strict_anomaly === true : true
                )
                .map((item: any) => {
                  return item && item.infos ? (
                    <tr key={item.sell.type_id}>
                      <td
                        style={{
                          verticalAlign: "middle",
                          height: "24px",
                          lineHeight: "24px",
                        }}
                      >
                        {!includes(item.infos.label.toLowerCase(), "skin") ? (
                          <img
                            alt={item.sell.type_id}
                            width="24"
                            height="24"
                            src={`https://images.evetech.net/types/${item.sell.type_id}/${item.infos.image_type}?size=64`}
                            style={{
                              marginRight: "5px",
                              verticalAlign: "middle",
                            }}
                          />
                        ) : null}

                        <a href="" onClick={(e) => addToMyItems(e, item.infos)}>
                          {item.infos.label}
                        </a>
                      </td>

                      <td>{formatCurrency(item.sell.volume_remain)} </td>
                      <td>{formatCurrency(item.sell.price)} ISK</td>
                      <td>{formatCurrency(item.second_sell.price)} ISK</td>
                      <td>
                        {formatCurrency(item.difference_with_second_sell_order)}{" "}
                        %
                      </td>
                      <td>{formatCurrency(item.buy.price)} ISK</td>
                      <td>{formatCurrency(item.median.price_average)} ISK</td>
                      <td>{formatCurrency(item.median.order_count_average)}</td>
                      <td>{formatCurrency(item.median.volume_average)}</td>
                    </tr>
                  ) : null;
                })
            ) : (
              <tr>
                <td colSpan={7}>No results</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </WatchListStyled>
  );
};
export default WatchList;
