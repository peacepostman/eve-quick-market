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
  const [stats, setStats] = useState<any>({});
  const [statsLoading, setStatsLoading] = useState(false);
  const [minMax, setMinMax] = useState<any>({});
  const [jumps, setJumps] = useState(0);
  const systemsRefs = useRef<any>([]);

  useEffect(() => {
    if (itemsData && itemsData.length > 0 && isEmpty(currentItem)) {
      console.log("setCurrentItem", itemsData[0]);
      setCurrentItem(itemsData[0]);
    }
  }, [itemsData]);

  useEffect(() => {
    if (!isEmpty(currentItem) && systemsData && systemsData.length > 0) {
      console.log("currentItem", currentItem);
      getItemStat();
    }
  }, [currentItem, systemsData, itemsData]);

  // useEffect(() => {
  //   getStats(itemsData, systemsData);
  // }, [systemsData, itemsData]);

  function getItemStat() {
    setStatsLoading(true);
    const statsData: any = {};
    console.log("currentItem", currentItem);
    for (let index = 0; index < systemsData.length; index++) {
      console.log(systemsData[index].value);
      fetch(
        `https://esi.evetech.net/latest/markets/${systemsData[index].region_id}/orders/?datasource=tranquility&order_type=sell&page=1&type_id=${currentItem.value}`
      ).then((response: any) => {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then((sells: any) => {
          fetch(
            `https://esi.evetech.net/latest/markets/${systemsData[index].region_id}/history/?datasource=tranquility&type_id=${currentItem.value}`
          ).then((response: any) => {
            if (response.status !== 200) {
              console.log(
                "Looks like there was a problem. Status Code: " +
                  response.status
              );
              return;
            }
            response.json().then((data: any) => {
              const systemOnly = filter(sells, {
                location_id: systemsData[index].value,
              });
              statsData[systemsData[index].value] = {};
              statsData[systemsData[index].value][currentItem.value] = {
                orderCount: systemOnly.length,
                volume: sum(map(systemOnly, "volume_remain")),
                min: min(map(systemOnly, "price")),
                max: max(map(systemOnly, "price")),
                median: mean(map(systemOnly, "price")),
                orders: sortBy(systemOnly, ["price"]),
                history: reverse(take(reverse(data), 10)),
              };
              if (size(statsData) === systemsData.length) {
                setStats(statsData);
                setTimeout(() => {
                  setStatsLoading(false);
                }, 200);
              }
            });
          });
        });
      });
    }
  }

  function getStats(itemsData: any, systemsData: any) {
    if (itemsData && itemsData.length > 0) {
      setStatsLoading(true);
      const statsData: any = {};
      const itemsId = itemsData.map((item: any) => item.value);
      for (let index = 0; index < systemsData.length; index++) {
        fetch(
          "https://market.fuzzwork.co.uk/aggregates/?station=" +
            systemsData[index].value +
            "&types=" +
            itemsId.join(",")
        ).then((response: any) => {
          if (response.status !== 200) {
            console.log(
              "Looks like there was a problem. Status Code: " + response.status
            );
            return;
          }
          response.json().then((data: any) => {
            statsData[systemsData[index].value] = data;
            if (size(statsData) === systemsData.length) {
              setStats(statsData);
              setTimeout(() => {
                setStatsLoading(false);
              }, 200);
            }
          });
        });
      }
    } else {
      setStatsLoading(false);
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
    const frozenItemData = [...itemsData];
    frozenItemData.splice(index, 1);
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
