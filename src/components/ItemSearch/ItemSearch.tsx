import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
import debounce from "lodash/debounce";

import EveOnlineAPI from "./../../model/eveOnlineApi";

import getSelectStyle from "./../../helpers/getSelectStyle";
import toastError from "./../../helpers/toastError";

const { Option } = components;
const ItemSearchOption = (props: any) => (
  <Option {...props}>
    {props.data.image_type ? (
      <img
        className="maybeUseClassName"
        src={`https://images.evetech.net/types/${props.data.value}/${props.data.image_type}?size=1024`}
        style={{
          width: 30,
          height: 30,
          marginRight: "10px",
        }}
        alt={props.data.label}
      />
    ) : null}
    {props.data.label}
  </Option>
);

const ItemSearch = (props: { onChangeCallback(data: any): void }) => {
  const { onChangeCallback } = props;
  const [search, setSearch] = useState<any>(null);

  const loadOptions = (value: string, callback: any) => {
    if (value) {
      const itemObject: any[] = [];
      EveOnlineAPI.searchItem(value)
        .then((response: any) => {
          if (
            response &&
            response.data &&
            response.data.inventory_type &&
            response.data.inventory_type.length > 0
          ) {
            for (
              let index = 0;
              index < response.data.inventory_type.length;
              index++
            ) {
              EveOnlineAPI.getItem(response.data.inventory_type[index])
                .then((dataItem: any) => {
                  itemObject.push(dataItem.data);
                  if (
                    itemObject.length === response.data.inventory_type.length
                  ) {
                    callback(
                      itemObject
                        .filter(
                          (item) => !item.name.toLowerCase().includes(" skin")
                        )
                        .map((item: any) => {
                          return {
                            value: item.type_id,
                            label: item.name,
                            image_type: item.name
                              .toLowerCase()
                              .includes("blueprint")
                              ? "bp"
                              : !item.icon_id
                              ? item.graphic_id
                                ? "render"
                                : null
                              : "icon",
                            packaged_volume: item.packaged_volume,
                            description: item.description,
                          };
                        })
                    );
                  }
                })
                .catch(toastError);
            }
          }
        })
        .catch(toastError);
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
        styles={getSelectStyle}
        components={{ Option: ItemSearchOption }}
        value={search}
        placeholder="Select an item"
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
