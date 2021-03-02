import React, { useState, useEffect, useMemo } from 'react';

import axios from 'axios';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import compact from 'lodash/compact';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import filter from 'lodash/filter';
import take from 'lodash/take';
import find from 'lodash/find';
import reverse from 'lodash/reverse';
import isEmpty from 'lodash/isEmpty';

import EveOnlineAPI from './../../model/eveOnlineApi';

import WatchListTable from './WatchListTable';
import WatchListTableItem from './WatchListTableItem';

import formatCurrency from './../../helpers/formatCurrency';
import getData from './../../helpers/getData';
import setData from './../../helpers/setData';
import getDefaultSystems from './../../helpers/getDefaultSystems';
import averagePerType from './../../helpers/averagePerType';

import historyType from './../../definitions/history';

import { WatchListStyled } from './WatchList.styled';

interface Props {
  playerSkill: any;
  forceReload: boolean;
  showDetailsModal(item: any): void;
}

const dataSystems = getData('systems');

const WatchList = (props: Props) => {
  const { playerSkill, showDetailsModal, forceReload } = props;
  const [systemsData, setSystemsData] = useState<any>(null);
  const [currentSystem, setCurrentSystem] = useState<any>();
  const [loadingWatched, setLoadingWatched] = useState<boolean>(false);
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [canRefresh, setCanRefresh] = useState<boolean>(false);
  const [rawItems, setRawItems] = useState<any>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [watchedItems, setWatchedItems] = useState<any[]>([]);
  const [refreshDate, setRefreshDate] = useState<any>();
  const [initialEndDate, setInitialEndDate] = useState<any>();

  // sell order quantity * sell order price
  const MINIMUM_TOTAL_SELL_AMOUNT = 500000;
  // gap in percent between first sell order and second sell order
  const GAP_BETWEEN_TWO_FIRST_SELLS_ORDERS = playerSkill.minimumMargin ? playerSkill.minimumMargin : 10;
  // gap in percent between first sell order and second sell order
  const MINIMUM_BENEFIT = playerSkill.minimumBenefit ? playerSkill.minimumBenefit : 500000;
  // gap in percent between first sell order and first buy order
  const GAP_BETWEEN_SELL_ORDER_AND_BUY_ORDER = playerSkill.gapTolerance ? playerSkill.gapTolerance : 5;

  useEffect(() => {
    setSystemsData(!isEmpty(dataSystems) ? dataSystems : getDefaultSystems());
  }, []);

  useEffect(() => {
    if (forceReload) {
      reload();
    }
  }, [forceReload]);

  useEffect(() => {
    if (systemsData && !currentSystem) {
      setCurrentSystem(find(systemsData, { value: playerSkill.favoriteStation ? playerSkill.favoriteStation.value : 60003760 }));
    }
  }, [systemsData]);

  useEffect(() => {
    if (currentSystem) {
      const hasStoredItems = getData('anomalies_' + currentSystem.value);
      if (hasStoredItems && hasStoredItems.length > 0) {
        let hasStoredDate = getData('anomalies_expire_' + currentSystem.value);
        if (hasStoredDate) {
          hasStoredDate = Number(hasStoredDate[0]);
          if (hasStoredDate < Date.now()) {
            setCanRefresh(false);
            getMarketOrders(1, []);
          } else {
            setWatchedItems(hasStoredItems);
            setRefreshDate(hasStoredDate);
            setInitialEndDate(hasStoredDate - Date.now());
          }
        }
      } else {
        setCanRefresh(false);
        getMarketOrders(1, []);
      }
    }
  }, [currentSystem]);

  useEffect(() => {
    if (isFetched) {
      console.log('processData');
      processData();
    }
  }, [isFetched]);

  useEffect(() => {
    if (filteredItems.length > 0) {
      console.log('finalProcess');
      finalProcess();
    }
  }, [filteredItems]);

  function selectSystem(val: any) {
    setCurrentSystem(val);
  }

  function getMarketOrders(page: number = 1, itemsArray: any[]) {
    setLoadingWatched(true);
    EveOnlineAPI.getMarketOrder(currentSystem.region_id, '', 'all', page.toString())
      .then((orders: any) => {
        itemsArray = itemsArray.concat(orders.data);
        if (page === 1) {
          setRefreshDate(new Date(orders.headers.expires).getTime());
        }
        if (parseInt(orders.headers['x-pages']) > page) {
          getMarketOrders(page + 1, itemsArray);
        } else {
          console.log('theEnd');
          setRawItems(itemsArray);
          setIsFetched(true);
        }
      })
      .catch((error: any) => {
        console.log('getMarketOrder::error::skippingPage', page);
        getMarketOrders(page + 1, itemsArray);
      });
  }

  function processData() {
    const groupedBy: any = groupBy(filter(compact(rawItems), { location_id: currentSystem.value }), 'type_id');
    const filteredOrders: any = [];
    for (const [key, value] of Object.entries(groupedBy)) {
      // @ts-ignore
      const buyOrders = orderBy(
        // @ts-ignore
        filter(value, { is_buy_order: true }),
        ['price'],
        ['desc']
      );
      // @ts-ignore
      const sellOrders: any = orderBy(
        // @ts-ignore
        filter(value, { is_buy_order: false }),
        ['price'],
        ['asc']
      );
      if (buyOrders.length > 0 && sellOrders.length > 1) {
        const minSellOrder: any = minBy(sellOrders, 'price');
        const maxBuyOrder: any = maxBy(buyOrders, 'price');

        if (minSellOrder && maxBuyOrder && minSellOrder.price * minSellOrder.volume_remain >= MINIMUM_TOTAL_SELL_AMOUNT) {
          const pricePercentageDifferenceWithSecondOrder =
            100 * Math.abs((sellOrders[1].price - minSellOrder.price) / ((sellOrders[1].price + minSellOrder.price) / 2));
          if (pricePercentageDifferenceWithSecondOrder > GAP_BETWEEN_TWO_FIRST_SELLS_ORDERS) {
            const marginBetweenTwoFirstOrder =
              sellOrders[1].price * minSellOrder.volume_remain -
              minSellOrder.price * minSellOrder.volume_remain -
              (sellOrders[1].price * minSellOrder.volume_remain * ((100 + (playerSkill.accountingLevel ? playerSkill.accountingLevel : 5)) / 100) -
                sellOrders[1].price * minSellOrder.volume_remain) -
              (sellOrders[1].price * minSellOrder.volume_remain * ((100 + (playerSkill.brokerFee ? playerSkill.brokerFee : 5)) / 100) -
                sellOrders[1].price * minSellOrder.volume_remain);

            if (marginBetweenTwoFirstOrder >= MINIMUM_BENEFIT) {
              filteredOrders.push({
                sell: minSellOrder,
                sell_data: sellOrders,
                sell_total: sellOrders.length,
                second_sell: sellOrders[1],
                difference_with_second_sell_order: pricePercentageDifferenceWithSecondOrder,
                margin_between_two_first_orders: marginBetweenTwoFirstOrder,
                strict_anomaly: minSellOrder.price < maxBuyOrder.price * ((100 + GAP_BETWEEN_SELL_ORDER_AND_BUY_ORDER) / 100),
                buy: maxBuyOrder,
                buy_data: buyOrders,
                buy_total: buyOrders.length,
              });
            }
          }
        }
      }
    }
    setIsFetched(false);
    setFilteredItems(filteredOrders);
    setData('anomalies_expire_' + currentSystem.value, refreshDate);
    setInitialEndDate(refreshDate - Date.now());
    setRawItems([]);
  }

  function finalProcess() {
    axios
      .all(
        filteredItems.map((item: any) =>
          EveOnlineAPI.getMarketHistory(currentSystem.region_id, item.sell.type_id.toString())
            .then((history: any) => {
              const historyDataCompact: historyType[] = take(reverse(history.data), 14);
              return {
                median: {
                  data: historyDataCompact,
                  price_average: averagePerType(historyDataCompact, 'average'),
                  order_count_average: averagePerType(historyDataCompact, 'order_count'),
                  volume_average: averagePerType(historyDataCompact, 'volume'),
                },
                ...item,
              };
            })
            .catch((error: any) => {
              console.log('getMarketHistory::error', error);
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
                    const name = itemInfo.data.name ? itemInfo.data.name : null;
                    return {
                      type_id: itemInfo.data.type_id,
                      value: itemInfo.data.type_id,
                      label: name ? name : 'Error item name',
                      image_type: name
                        ? name.toLowerCase().includes('blueprint')
                          ? 'bp'
                          : !itemInfo.data.icon_id
                          ? itemInfo.data.graphic_id
                            ? 'render'
                            : null
                          : 'icon'
                        : 'icon',
                      volume: itemInfo.data.volume,
                      packaged_volume: itemInfo.data.packaged_volume,
                      description: itemInfo.data.description,
                    };
                  })
                  .catch((error: any) => {
                    console.log('getItem::error', error);
                  })
              )
            )
            .then(
              axios.spread((...infos) => {
                const final = finalArray.map((item: any, index: number) => {
                  const itemInfo = find(infos, { type_id: item.sell.type_id });
                  if (infos) {
                    return {
                      ...item,
                      infos: itemInfo,
                    };
                  }
                });
                const finalCleaned = compact(final);
                setData('anomalies_' + currentSystem.value, finalCleaned);
                setWatchedItems(finalCleaned);
                setLoadingWatched(false);
                setFilteredItems([]);
              })
            )
            .catch((error: any) => {
              console.log('getItems::error', error);
            });
        })
      )
      .catch((error: any) => {
        console.log('getMarketHistories::error', error);
      });
  }

  function reload() {
    setIsFetched(false);
    setCanRefresh(false);
    setLoadingWatched(true);
    setRawItems([]);
    setFilteredItems([]);
    setWatchedItems([]);
    setTimeout(() => {
      getMarketOrders(1, []);
    }, 100);
  }

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Item Name',
        accessor: 'infos.label',
        canSort: false,
        disableSortBy: true,
        Cell: (item: any) => <WatchListTableItem item={item} showDetailsModal={showDetailsModal} />,
      },
      {
        Header: 'Quantity',
        accessor: 'sell.volume_remain',
        Cell: ({ value }: any) => {
          return formatCurrency(value);
        },
      },
      {
        Header: '1st sell (2nd sell)',
        accessor: 'sell.price',
        Cell: (item: any) => {
          return (
            <>
              <span style={{ display: 'block' }}>{formatCurrency(item.value)} ISK </span>
              <small style={{ display: 'block' }}>({formatCurrency(item.row.original.second_sell.price)} ISK)</small>
            </>
          );
        },
      },
      {
        Header: '1st buy',
        accessor: 'buy.price',
        Cell: ({ value }: any) => {
          return formatCurrency(value) + ' ISK';
        },
      },
      {
        Header: 'Margin',
        accessor: 'difference_with_second_sell_order',
        Cell: ({ value }: any) => {
          return formatCurrency(value) + '%';
        },
      },
      {
        Header: 'Margin ISK',
        accessor: 'margin_between_two_first_orders',
        Cell: ({ value }: any) => {
          return formatCurrency(value) + ' ISK';
        },
      },
      {
        Header: 'Price 14d',
        accessor: 'median.price_average',
        Cell: ({ value }: any) => {
          return formatCurrency(Math.round(value)) + ' ISK';
        },
      },
      {
        Header: 'Vol. 14d',
        accessor: 'median.volume_average',
        Cell: ({ value }: any) => {
          return formatCurrency(Math.round(value));
        },
      },
      {
        Header: 'Order 14d',
        accessor: 'median.order_count_average',
        Cell: ({ value }: any) => {
          return formatCurrency(Math.round(value));
        },
      },
      {
        Header: 'strict',
        accessor: (row: any) => {
          return 'strict_' + row.strict_anomaly;
        },
        Cell: ({ value }: any) => {
          return '';
        },
        width: 0,
      },
    ],
    []
  );

  return (
    <WatchListStyled>
      <WatchListTable
        columns={tableColumns}
        data={watchedItems}
        system={currentSystem}
        selectSystem={selectSystem}
        reload={reload}
        initialEndDate={initialEndDate}
        refreshDate={refreshDate}
        canRefresh={canRefresh}
        setCanRefresh={setCanRefresh}
        loadingWatched={loadingWatched}
        playerSkill={playerSkill}
      />
    </WatchListStyled>
  );
};
export default WatchList;
