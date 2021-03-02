import React from 'react';
import { useTable, useSortBy, useGlobalFilter } from 'react-table';
import WatchListTableFilter from './WatchListTableFilter';
import Loader from './../Loader';
import { WatchListLoaderStyled } from './WatchList.styled';

const WatchListTable = ({
  columns,
  data,
  system,
  selectSystem,
  reload,
  initialEndDate,
  refreshDate,
  canRefresh,
  setCanRefresh,
  loadingWatched,
  playerSkill,
}: any) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, preGlobalFilteredRows, setGlobalFilter }: any = useTable(
    {
      columns,
      data,
      initialState: {
        // @ts-ignore
        sortBy: [
          {
            id: 'margin_between_two_first_orders',
            desc: true,
          },
        ],
      },
    },
    useGlobalFilter,
    useSortBy
  );

  return (
    <>
      <WatchListTableFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
        system={system}
        selectSystem={selectSystem}
        reload={reload}
        initialEndDate={initialEndDate}
        refreshDate={refreshDate}
        canRefresh={canRefresh}
        setCanRefresh={setCanRefresh}
        playerSkill={playerSkill}
      />
      {loadingWatched ? (
        <WatchListLoaderStyled>
          <Loader color={'#fff'} />
        </WatchListLoaderStyled>
      ) : data && data.length > 0 ? (
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup: any) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any) => (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    {column.canSort ? (
                      <div className="arrow-wrapper">
                        <span className={'arrow' + (column.isSorted && !column.isSortedDesc ? ' is-active' : '')}></span>
                        <span className={'arrow is-down' + (column.isSorted && column.isSortedDesc ? ' is-active' : '')}></span>
                      </div>
                    ) : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row: any, i: any) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell: any) => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}
    </>
  );
};

export default WatchListTable;
