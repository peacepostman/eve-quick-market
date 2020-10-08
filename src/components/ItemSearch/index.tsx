import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";

const fetchOption: any = {
  method: "GET",
  headers: {
    accept: "application/json",
    "Accept-Language": "en-us",
  },
  mode: "cors",
  cache: "default",
};

const ItemSearch = (props: { onChangeCallback(data: any): void }) => {
  const { onChangeCallback } = props;
  const [search, setSearch] = useState<any>(null);

  const loadOptions = (value: string, callback: any) => {
    if (value) {
      const itemObject: any[] = [];
      fetch(
        "https://esi.evetech.net/latest/search/?categories=inventory_type&datasource=tranquility&language=en-us&search=" +
          value +
          "&strict=false",
        fetchOption
      ).then((response: any) => {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }
        response.json().then((data: any) => {
          if (data && data.inventory_type && data.inventory_type.length > 0) {
            for (let index = 0; index < data.inventory_type.length; index++) {
              fetch(
                "https://esi.evetech.net/latest/universe/types/" +
                  data.inventory_type[index] +
                  "/?datasource=tranquility",
                fetchOption
              ).then((responseStation: any) => {
                if (responseStation.status !== 200) {
                  console.log(
                    "Looks like there was a problem. Status Code: " +
                      responseStation.status
                  );
                  return;
                }
                responseStation.json().then((dataItem: any) => {
                  itemObject.push(dataItem);
                  if (itemObject.length === data.inventory_type.length) {
                    callback(
                      itemObject.map((item: any) => {
                        return {
                          value: item.type_id,
                          label: item.name,
                          volume: item.volume,
                          description: item.description,
                        };
                      })
                    );
                  }
                });
              });
            }
          }
        });
      });
    }
  };

  const debouncedLoadOptions = debounce(loadOptions, 500);

  function onChange(val: any) {
    setSearch(val);
    onChangeCallback(val);
    setTimeout(() => {
      setSearch(null);
    }, 200);
  }

  return (
    <div
      style={{
        width: "30%",
        marginLeft: "50%",
        marginBottom: "60px",
        transform: "translateX(-50%)",
      }}
    >
      <AsyncSelect
        value={search}
        placeholder="Selectionnez un item"
        menuPortalTarget={document.body}
        onChange={onChange}
        cacheOptions
        loadOptions={debouncedLoadOptions}
        defaultOptions
      />
    </div>
  );
};

export default ItemSearch;
