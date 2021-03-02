import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  system,
  selectSystem,
  reload,
  refreshDate,
  initialEndDate,
  canRefresh,
  setCanRefresh,
  playerSkill,
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
  const switchRef = useRef<any>(null);

  useEffect(() => {
    if (initialEndDate && initialEndDate !== storedEndDate) {
      setStoredEndDate(initialEndDate);
    }
  }, [initialEndDate, storedEndDate]);

  const onCountdownTick = useCallback(
    (infos: any) => {
      const percent = (100 * infos.total) / storedEndDate;
      setPercentLeft(percent);
    },
    [storedEndDate]
  );

  const launchReload = (e: any) => {
    e.preventDefault();
    if (canRefresh) {
      reload();
      onChange('');
      if (switchRef && switchRef.current) {
        switchRef.current.checked = false;
      }
    }
  };

  const options = !isEmpty(dataSystems) ? dataSystems : getDefaultSystems();

  return (
    <WatchListHeaderStyled>
      <div style={{ maxWidth: '400px', marginBottom: '10px' }}>
        <Select
          styles={getSelectStyle}
          options={options}
          defaultValue={system ? system : playerSkill && playerSkill.favoriteStation ? playerSkill.favoriteStation : options[0]}
          placeholder="Select accounting level"
          onChange={selectSystem}
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
              <img src="img/reload.svg" alt="reload" style={{ width: '14px', height: '14px', marginTop: '-7px' }} />
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
        ref={switchRef}
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
