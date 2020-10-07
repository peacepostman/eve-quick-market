import React, { useEffect, useState } from "react";
import size from "lodash/size";
import MainWrapper from "./components/MainWrapper";
import SystemCardWrapper from "./components/SystemCardWrapper";
import SystemCard from "./components/SystemCard";
import SystemCardAdd from "./components/SystemCardAdd";

import ItemWrapper from "./components/ItemWrapper";

import ItemCard from "./components/ItemCard";
import ItemCardWrapper from "./components/ItemCardWrapper";
import ItemSearch from "./components/ItemSearch";
import getData from "./helpers/getData";
import setData from "./helpers/setData";

const App: React.FC = () => {
  const [systemsData, setSystemsData] = useState(getData("systems"));
  const [itemsData, setItemsData] = useState(getData("items"));
  const [currentItem, setCurrentItem] = useState(null);
  const [stats, setStats] = useState<any>({});
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (itemsData && itemsData.length > 0 && !currentItem) {
      setCurrentItem(itemsData[0]);
    }
  }, [itemsData, currentItem]);

  useEffect(() => {
    console.log("getStats", systemsData);
    getStats(itemsData, systemsData);
  }, [systemsData, itemsData]);

  function getStats(itemsData: any, systemsData: any) {
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
              console.log("newStats", statsData);
              setStatsLoading(false);
            }, 200);
          }
        });
      });
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
    if (itemsData.length > 0) {
      setItemsData(setData("items", [...itemsData, itemInfo]));
    } else {
      setItemsData(setData("items", itemInfo));
    }
  }

  function deleteItem(index: number) {
    const frozenItemData = [...itemsData];
    frozenItemData.splice(index, 1);
    setItemsData(setData("items", frozenItemData));
  }

  function selectItem(item: any) {
    setCurrentItem(item);
  }

  return (
    <MainWrapper>
      <ItemWrapper>
        <ItemSearch onChangeCallback={addItem} />
        <ItemCardWrapper>
          {itemsData.map((item: any, index: number) => (
            <ItemCard
              key={item.value}
              item={item}
              select={selectItem}
              selected={
                currentItem !== null && currentItem.value === item.value
              }
              deleteItem={() => deleteItem(index)}
            />
          ))}
        </ItemCardWrapper>
      </ItemWrapper>

      <SystemCardWrapper>
        {systemsData.map((system: any, index: number) => (
          <SystemCard
            key={system.value}
            system={system}
            currentItem={currentItem}
            stats={stats}
            loading={statsLoading}
            deleteSystem={() => deleteSystem(index)}
          />
        ))}
        <SystemCardAdd onClick={addSystem} />
      </SystemCardWrapper>
    </MainWrapper>
  );
};

export default App;
