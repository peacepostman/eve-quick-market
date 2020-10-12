import React, { useEffect, useState, useRef } from "react";
import size from "lodash/size";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import mean from "lodash/mean";
import map from "lodash/map";
import min from "lodash/min";
import max from "lodash/max";
import sum from "lodash/sum";
import take from "lodash/take";
import reverse from "lodash/reverse";
import sortBy from "lodash/sortBy";

import EveOnlineAPI from "./model/eveOnlineApi";

import MainWrapper from "./components/MainWrapper";
import SystemCardWrapper from "./components/SystemCardWrapper";
import SystemCard from "./components/SystemCard";
import SystemCardHint from "./components/SystemCardHint";
import SystemCardAdd from "./components/SystemCardAdd";
import ItemWrapper from "./components/ItemWrapper";
import ItemCard from "./components/ItemCard";
import ItemCardWrapper from "./components/ItemCardWrapper";
import ItemSearch from "./components/ItemSearch";
import Calculator from "./components/Calculator";

import getData from "./helpers/getData";
import setData from "./helpers/setData";

const App: React.FC = () => {
  const [systemsData, setSystemsData] = useState(getData("systems"));
  const [itemsData, setItemsData] = useState(getData("items"));
  const [currentItem, setCurrentItem] = useState<any>({});
  const [stats, setStats] = useState<any>(getData("stats", true));
  const [statsLoading, setStatsLoading] = useState(false);
  const [minMax, setMinMax] = useState<any>({});
  const [jumps, setJumps] = useState(0);
  const systemsRefs = useRef<any>([]);

  useEffect(() => {
    if (itemsData && itemsData.length > 0 && isEmpty(currentItem)) {
      setCurrentItem(itemsData[0]);
    }
  }, [itemsData]);

  useEffect(() => {
    if (!isEmpty(currentItem) && systemsData && systemsData.length > 0) {
      getItemStat();
    }
  }, [currentItem, systemsData, itemsData]);

  function getItemStat() {
    setStatsLoading(true);
    const statsData: any = {};

    for (let index = 0; index < systemsData.length; index++) {
      if (
        stats &&
        stats[systemsData[index].value] &&
        stats[systemsData[index].value][currentItem.value] &&
        stats[systemsData[index].value][currentItem.value].cache_expire &&
        stats[systemsData[index].value][currentItem.value].cache_expire >
          Date.now()
      ) {
        setStatsLoading(false);
        return;
      } else {
        EveOnlineAPI.marketSellOrder(
          systemsData[index].region_id,
          currentItem.value
        ).then((sells: any) => {
          EveOnlineAPI.marketHistory(
            systemsData[index].region_id,
            currentItem.value
          ).then((history: any) => {
            const systemOnly = filter(sells.data, {
              location_id: systemsData[index].value,
            });

            if (stats && stats[systemsData[index].value]) {
              statsData[systemsData[index].value] = {
                ...stats[systemsData[index].value],
              };
            } else {
              statsData[systemsData[index].value] = {};
            }

            statsData[systemsData[index].value][currentItem.value] = {
              orderCount: systemOnly.length,
              cache_expire: new Date(sells.headers.expires).getTime(),
              volume: sum(map(systemOnly, "volume_remain")),
              min: min(map(systemOnly, "price")),
              max: max(map(systemOnly, "price")),
              median: mean(map(systemOnly, "price")),
              orders: take(sortBy(systemOnly, ["price"]), 5),
              history: reverse(take(reverse(history.data), 10)),
            };
            if (size(statsData) === systemsData.length) {
              setStats(statsData);
              setData("stats", statsData, true);
              setTimeout(() => {
                setStatsLoading(false);
              }, 200);
            }
          });
        });
      }
    }
  }

  function addSystem(systemInfo: any) {
    setStatsLoading(true);
    if (systemsData.length > 0) {
      setSystemsData(setData("systems", [...systemsData, systemInfo]));
    } else {
      setSystemsData(setData("systems", systemInfo));
    }
  }

  function deleteSystem(index: number) {
    let frozenStats = stats;
    delete frozenStats[index];
    setStats(setData("stats", frozenStats));

    let frozenSystemData = [...systemsData];
    frozenSystemData.splice(index, 1);
    setStatsLoading(true);
    setSystemsData(setData("systems", frozenSystemData));
  }

  function addItem(itemInfo: any) {
    setStatsLoading(true);
    if (itemsData.length > 0) {
      setItemsData(setData("items", [...itemsData, itemInfo]));
    } else {
      setItemsData(setData("items", itemInfo));
    }
  }

  function deleteItem(index: number) {
    let frozenStats = stats;
    for (const [key, value] of Object.entries(frozenStats) as any) {
      if (value[index]) {
        delete value[index];
      }
    }
    setStats(setData("stats", frozenStats));

    const frozenItemData = [...itemsData];
    const deleted: any = frozenItemData.splice(index, 1);
    if (deleted.length > 0 && deleted[0].value === currentItem.value) {
      if (frozenItemData.length > 0) {
        setTimeout(() => {
          setCurrentItem(frozenItemData[frozenItemData.length - 1]);
        }, 200);
      }
    }
    setStatsLoading(true);
    setItemsData(setData("items", frozenItemData));
  }

  function selectItem(item: any) {
    setCurrentItem(item);
  }

  function onCallback(minMax: any, jumps: number) {
    setMinMax(minMax);
    setJumps(jumps);
  }

  return (
    <MainWrapper>
      <ItemWrapper>
        <ItemSearch onChangeCallback={addItem} />
        <ItemCardWrapper>
          {itemsData.length > 0
            ? itemsData.map((item: any, index: number) => (
                <ItemCard
                  key={item.value}
                  item={item}
                  select={selectItem}
                  currentItem={currentItem}
                  deleteItem={() => deleteItem(index)}
                />
              ))
            : null}
        </ItemCardWrapper>
      </ItemWrapper>

      <SystemCardWrapper>
        {systemsData.length > 0
          ? systemsData.map((system: any, index: number) => (
              <SystemCard
                key={system.value}
                ref={(ref) => (systemsRefs.current[index] = ref)}
                system={system}
                currentItem={currentItem}
                stats={stats}
                lowest={
                  minMax &&
                  minMax.min !== undefined &&
                  system.value === minMax.min.place.value
                }
                highest={
                  minMax &&
                  minMax.max !== undefined &&
                  system.value === minMax.max.place.value
                }
                loading={statsLoading}
                deleteSystem={() => deleteSystem(index)}
              />
            ))
          : null}
        <SystemCardHint
          systemsRef={systemsRefs}
          minMax={minMax}
          jumps={jumps}
        />
        <SystemCardAdd onClick={addSystem} />
      </SystemCardWrapper>

      <Calculator
        stats={stats}
        loading={statsLoading}
        systemsData={systemsData}
        currentItem={currentItem}
        onCallback={onCallback}
      />
    </MainWrapper>
  );
};

export default App;
