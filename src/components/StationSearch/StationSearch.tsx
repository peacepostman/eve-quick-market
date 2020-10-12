import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
import debounce from "lodash/debounce";
import sortBy from "lodash/sortBy";
import find from "lodash/find";

import EveOnlineAPI from "./../../model/eveOnlineApi";

import stationPerRegion from "./../../data/regionPerStation";
import getSelectStyle from "./../../helpers/getSelectStyle";
import toastError from "./../../helpers/toastError";

const { Option } = components;
const SystemSearchOption = (props: any) => (
  <Option {...props}>
    {props.data.max ? (
      <img
        className="maybeUseClassName"
        src={`img/hub.png`}
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

function getRegionId(stationID: number) {
  if (stationPerRegion && stationPerRegion.length > 0) {
    return find(stationPerRegion, {
      s_id: stationID,
    })?.r_id;
  } else {
    return null;
  }
}

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
      EveOnlineAPI.searchStation(value)
        .then((response: any) => {
          if (
            response &&
            response.data &&
            response.data.station &&
            response.data.station.length > 0
          ) {
            for (let index = 0; index < response.data.station.length; index++) {
              EveOnlineAPI.getStation(response.data.station[index]).then(
                (dataStation: any) => {
                  stationObject.push(dataStation.data);
                  if (stationObject.length === response.data.station.length) {
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
                          region_id: getRegionId(item.station_id),
                          max: indexOfMaxValue === index,
                        };
                      })
                    );
                  }
                }
              );
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
  }

  return (
    <AsyncSelect
      styles={getSelectStyle}
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
