import React, { useState, useEffect, useCallback } from 'react';
import { useAsyncDebounce } from 'react-table';
import Select from 'react-select';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import isEmpty from 'lodash/isEmpty';
import CountDown from './../CountDown';
import Switch from './../Switch';
import getSelectStyle from './../../helpers/getSelectStyle';
import getData from './../../helpers/getData';
import getDefaultSystems from './../../helpers/getDefaultSystems';
import { WatchListHeaderStyled, WatchListReload } from './WatchList.styled';

const dataSystems = getData('systems');

const WatchListTableFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  station,
  reload,
  refreshDate,
  initialEndDate,
  canRefresh,
  setCanRefresh,
}: any) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const [percentLeft, setPercentLeft] = useState(100);
  const [storedEndDate, setStoredEndDate] = useState<any>(null);
  const onChange = useAsyncDebounce((value) => {
    if (value === true) {
      value = 'strict_true';
    } else {
      value = '';
    }
    setGlobalFilter(value || undefined);
  }, 200);

  useEffect(() => {
    if (initialEndDate && initialEndDate !== storedEndDate) {
      console.log('setStoredEndDate', initialEndDate);
      setStoredEndDate(initialEndDate);
    }
  }, [initialEndDate, storedEndDate]);

  const onCountdownTick = useCallback(
    (infos: any) => {
      console.log('infos', infos, storedEndDate);
      const percent = (100 * infos.total) / storedEndDate;
      setPercentLeft(percent);
    },
    [storedEndDate]
  );

  console.log({ percentLeft });

  const launchReload = (e: any) => {
    e.preventDefault();
    if (canRefresh) {
      reload();
    }
  };

  const options = !isEmpty(dataSystems) ? dataSystems : getDefaultSystems();

  return (
    <WatchListHeaderStyled>
      <div style={{ maxWidth: '400px', marginBottom: '10px' }}>
        <Select
          styles={getSelectStyle}
          options={options}
          defaultValue={options[0]}
          placeholder="Select accounting level"
          onChange={(val: any) => console.log('vali', val)}
        />
      </div>
      <WatchListReload onClick={launchReload} disabled={!canRefresh}>
        {storedEndDate ? (
          <CircularProgressbarWithChildren
            value={percentLeft}
            styles={buildStyles({
              strokeLinecap: 'butt',
              pathColor: !canRefresh ? '#b3bbc0' : '#72d363',
              trailColor: '#101618',
            })}
          >
            {canRefresh ? (
              <img src="img/reload.svg" style={{ width: '14px', height: '14px', marginTop: '-7px' }} />
            ) : (
              <CountDown
                expire={refreshDate}
                onTick={onCountdownTick}
                onComplete={() => {
                  setCanRefresh(true);
                }}
              />
            )}
          </CircularProgressbarWithChildren>
        ) : null}
      </WatchListReload>

      <Switch
        aria-labelledby="Show only true market anomalies"
        name="strict_only"
        variant="sm"
        onChange={(e: any) => {
          setValue(e.target.checked);
          onChange(e.target.checked);
        }}
        defaultIsChecked={false}
      >
        <div className="text-sm">Show only true market anomalies</div>
      </Switch>
      {/* 
      <label htmlFor="strict_only">
        <input
          onChange={(e) => {
            setValue(e.target.checked);
            onChange(e.target.checked);
          }}
          type="checkbox"
          checked={value ? value : false}
          id="strict_only"
          name="strict_only"
        />
        Show only true market anomalies
      </label> */}
    </WatchListHeaderStyled>
  );
};

export default WatchListTableFilter;
