import React, { useState, useEffect } from "react";
import sortBy from "lodash/sortBy";
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
const SystemSearchOption = (props: any) => (
  <Option {...props}>
    {props.data.max ? (
      <img
        className="maybeUseClassName"
        src={`img/stock.svg`}
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

const StationSearch = (props: {
  onChangeCallback(data: any): void;
  reset: boolean;
}) => {
  const { onChangeCallback, reset } = props;
  const [search, setSearch] = useState<any>(null);

  useEffect(() => {
    if (reset) {
      setSearch(null);
    }
  }, [reset]);

  const loadOptions = (value: string, callback: any) => {
    if (value) {
      const stationObject: any[] = [];
      fetch(
        "https://esi.evetech.net/latest/search/?categories=station&datasource=tranquility&language=en-us&search=" +
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
          if (data && data.station && data.station.length > 0) {
            for (let index = 0; index < data.station.length; index++) {
              fetch(
                "https://esi.evetech.net/latest/universe/stations/" +
                  data.station[index] +
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
                responseStation.json().then((dataStation: any) => {
                  stationObject.push(dataStation);
                  if (stationObject.length === data.station.length) {
                    const sortedAndFiltered = sortBy(
                      stationObject.filter((item) => {
                        const splitted = item.name.split(" - ");
                        return splitted[0]
                          .toLowerCase()
                          .includes(value.toLowerCase());
                      }),
                      ["name"]
                    );

                    const arrayMaxLocation = sortedAndFiltered.map((item) => {
                      return item.office_rental_cost;
                    });

                    const indexOfMaxValue = arrayMaxLocation.indexOf(
                      Math.max(...arrayMaxLocation)
                    );

                    callback(
                      sortedAndFiltered.map((item: any, index: number) => {
                        return {
                          value: item.station_id,
                          label: item.name,
                          system_id: item.system_id,
                          max: indexOfMaxValue === index,
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
  }

  return (
    <AsyncSelect
      styles={{
        menuPortal: (provided) => ({ ...provided, zIndex: 5 }),
        option: (provided: any) => ({
          ...provided,
          display: "flex",
          alignItems: "center",
        }),
      }}
      components={{ Option: SystemSearchOption }}
      value={search}
      placeholder="Select a station"
      menuPortalTarget={document.body}
      onChange={onChange}
      cacheOptions
      loadOptions={debouncedLoadOptions}
      defaultOptions
    />
  );
};

export default StationSearch;
