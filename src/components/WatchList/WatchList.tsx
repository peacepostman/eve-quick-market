import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import minBy from "lodash/minBy";
import maxBy from "lodash/maxBy";
import meanBy from "lodash/meanBy";
import compact from "lodash/compact";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import filter from "lodash/filter";
import take from "lodash/take";
import find from "lodash/find";
import reverse from "lodash/reverse";
import Loader from "./../Loader";
import EveOnlineAPI from "./../../model/eveOnlineApi";
import formatCurrency from "./../../helpers/formatCurrency";
import { WatchListStyled } from "./WatchList.styled";

const WatchList = (props: any) => {
  const [loadingWatched, setLoadingWatched] = useState<boolean>(false);
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [rawItems, setRawItems] = useState<any>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [watchedItems, setWatchedItems] = useState<any[]>([]);
  const [refreshDate, setRefreshDate] = useState<any>(null);
  const [refreshTimeArray, setRefreshTimeArray] = useState<any>([]);

  const regionID = "10000002";
  const stationID = 60003760;

  useEffect(() => {
    getMarketOrders();
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
    EveOnlineAPI.getMarketOrder(regionID, "", "all", page.toString()).then(
      (orders: any) => {
        setRawItems((prev: any) => prev.concat(orders.data));
        setRefreshTimeArray((prev: any) =>
          prev.concat(new Date(orders.headers.expires).getTime())
        );
        if (parseInt(orders.headers["x-pages"]) > page) {
          getMarketOrders(page + 1);
        } else {
          setIsFetched(true);
        }
      }
    );
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
              console.log("error", error);
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
                EveOnlineAPI.getItem(item.sell.type_id.toString()).then(
                  (itemInfo: any) => {
                    return {
                      type_id: itemInfo.data.type_id,
                      name: itemInfo.data.name,
                      volume: itemInfo.data.volume,
                      packaged_volume: itemInfo.data.packaged_volume,
                    };
                  }
                )
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
                setWatchedItems(final);
                setLoadingWatched(false);
              })
            );
        })
      );
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
      if (buyOrders.length > 0 && sellOrders.length > 0) {
        const minSellOrder: any = minBy(sellOrders, "price");
        const maxBuyOrder: any = maxBy(buyOrders, "price");

        if (
          minSellOrder &&
          maxBuyOrder &&
          minSellOrder.price < maxBuyOrder.price * 1.05
        ) {
          if (sellOrders[1]) {
            const priceDifferenceWithSecondOrder =
              100 *
              Math.abs(
                (sellOrders[1].price - minSellOrder.price) /
                  ((sellOrders[1].price + minSellOrder.price) / 2)
              );
            if (priceDifferenceWithSecondOrder > 10) {
              filteredOrders.push({
                sell: minSellOrder,
                second_sell: sellOrders[1],
                buy: maxBuyOrder,
              });
            }
          }
        }
      }
    }
    setFilteredItems(filteredOrders);
  }, [rawItems, refreshTimeArray]);

  return (
    <WatchListStyled>
      {loadingWatched ? (
        <Loader />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Total available</th>
              <th>sell order price</th>
              <th>second sell order price</th>
              <th>buy order price</th>
              <th>average price 7 days</th>
              <th>average order count 7 days</th>
              <th>average volume 7 days</th>
            </tr>
          </thead>
          <tbody>
            {watchedItems.map((item: any) => {
              return (
                <tr key={item.sell.type_id}>
                  <td
                    style={{
                      verticalAlign: "middle",
                      height: "24px",
                      lineHeight: "24px",
                    }}
                  >
                    <img
                      alt={item.sell.type_id}
                      width="24"
                      height="24"
                      src={`https://images.evetech.net/types/${item.sell.type_id}/icon?size=64`}
                      style={{ marginRight: "5px", verticalAlign: "middle" }}
                    />
                    <span>{item.infos.name}</span>
                  </td>

                  <td>{formatCurrency(item.sell.volume_remain)} </td>
                  <td>{formatCurrency(item.sell.price)} ISK</td>
                  <td>{formatCurrency(item.second_sell.price)} ISK</td>
                  <td>{formatCurrency(item.buy.price)} ISK</td>
                  <td>{formatCurrency(item.median.price_average)} ISK</td>
                  <td>{formatCurrency(item.median.order_count_average)}</td>
                  <td>{formatCurrency(item.median.volume_average)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </WatchListStyled>
  );
};
export default WatchList;
