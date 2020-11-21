import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";

const WatchListTableFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: any) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    if (value === true) {
      value = "strict_true";
    } else {
      value = "strict_false";
    }
    setGlobalFilter(value || undefined);
  }, 200);

  return (
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
    </label>
  );
};

export default WatchListTableFilter;
