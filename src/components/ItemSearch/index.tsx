import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
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
        styles={{
          menuPortal: (provided) => ({ ...provided, zIndex: 5 }),
          option: (provided: any, state) => ({
            ...provided,
            display: "flex",
            alignItems: "center",
            color: state.isSelected || state.isFocused ? "#fff" : "#ddd",
            backgroundColor:
              state.isSelected || state.isFocused
                ? "rgba(255, 255, 255, .2)"
                : "transparent",
          }),
          control: (provided, state) => ({
            ...provided,
            backgroundColor: "rgb(19, 36, 44)",
            borderRadius: 0,
            borderColor: state.isFocused ? "#fff" : "rgba(255, 255, 255, .6)",
            boxShadow: state.isFocused ? "none" : "none",
            "&:hover": {
              borderColor: state.isFocused ? "#fff" : "rgba(255, 255, 255, .8)",
            },
          }),
          input: (provided) => ({ ...provided, color: "#fff" }),
          menu: (provided) => ({
            ...provided,
            backgroundColor: "rgba(19, 36, 44, .4)",
            border: "1px solid rgba(255, 255, 255, .6)",
            borderRadius: 0,
            backdropFilter: "blur(6px)",
          }),
        }}
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
