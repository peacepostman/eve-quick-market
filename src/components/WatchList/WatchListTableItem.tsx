import React from 'react';
import { toast } from 'react-toastify';
import CopyToClipboard from 'react-copy-to-clipboard';
import includes from 'lodash/includes';

interface Props {
  item: any;
}

const WatchListTableItem = (props: Props) => {
  const { item } = props;

  function copySuccess() {
    toast.success('Item name copied to clipboard', {
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  function openDetails(e: any) {
    e.preventDefault();
    console.log('data', item.row.original);
  }

  return (
    <>
      {!includes(item.value.toLowerCase(), 'skin') ? (
        <img
          alt={item.row.original.sell.type_id}
          width="24"
          height="24"
          src={`https://images.evetech.net/types/${item.row.original.sell.type_id}/${item.row.original.infos.image_type}?size=64`}
          style={{
            marginRight: '8px',
            verticalAlign: 'middle',
          }}
        />
      ) : null}

      {item.value}
      <span className="row-actions">
        <CopyToClipboard text={item.value} onCopy={copySuccess}>
          <img
            src="img/copy.svg"
            width="22"
            height="22"
            style={{
              verticalAlign: 'middle',
            }}
          />
        </CopyToClipboard>
        <a href="" onClick={openDetails}>
          <img
            src="img/zoom.svg"
            width="22"
            height="22"
            style={{
              marginLeft: '5px',
              verticalAlign: 'middle',
            }}
          />
        </a>
      </span>
    </>
  );
};

export default React.memo(WatchListTableItem);
