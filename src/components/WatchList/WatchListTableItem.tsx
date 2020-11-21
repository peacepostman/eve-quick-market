import React from "react";
import { toast } from "react-toastify";
import CopyToClipboard from "react-copy-to-clipboard";
import includes from "lodash/includes";

interface Props {
  item: any;
  addToItems(item: any): void;
}

const WatchListTableItem = (props: Props) => {
  const { item, addToItems } = props;

  function addToMyItems(e: any, item: any) {
    e.preventDefault();
    addToItems(item);
    toast.success("Successfully added to items list", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  function copySuccess() {
    toast.success("Item name copied to clipboard", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  function addItem(e: any) {
    e.preventDefault();
    addToMyItems(e, item.row.original.infos);
  }

  return (
    <>
      {!includes(item.value.toLowerCase(), "skin") ? (
        <img
          alt={item.row.original.sell.type_id}
          width="24"
          height="24"
          src={`https://images.evetech.net/types/${item.row.original.sell.type_id}/${item.row.original.infos.image_type}?size=64`}
          style={{
            marginRight: "5px",
            verticalAlign: "middle",
          }}
        />
      ) : null}

      <a href="" onClick={addItem}>
        {item.value}
      </a>
      <span className="copy">
        <CopyToClipboard text={item.value} onCopy={copySuccess}>
          <img
            src="img/copy.svg"
            width="22"
            height="22"
            style={{
              marginLeft: "5px",
              verticalAlign: "middle",
            }}
          />
        </CopyToClipboard>
      </span>
    </>
  );
};

export default React.memo(WatchListTableItem);
