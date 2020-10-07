import React, { useState, useEffect } from "react";
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
                    callback(
                      stationObject.map((item: any) => {
                        return {
                          value: item.station_id,
                          label: item.name,
                          system_id: item.system_id,
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
      value={search}
      placeholder="Selectionnez une station"
      menuPortalTarget={document.body}
      onChange={onChange}
      cacheOptions
      loadOptions={debouncedLoadOptions}
      defaultOptions
    />
  );
};

export default StationSearch;
