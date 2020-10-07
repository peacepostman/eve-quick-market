import React from "react";
import { ItemCardStyled, ItemCardDelete } from "./index.styled";

interface Props {
  item: any;
  select(item: any): void;
  currentItem: any;
  deleteItem?(system: any): void;
}

const ItemCard: React.FC<Props> = (props) => {
  const { item, select, currentItem, deleteItem } = props;
  const selected =
    currentItem && currentItem !== null && currentItem.value === item.value;
  return (
    <ItemCardStyled selected={selected} onClick={() => select(item)}>
      <img
        alt={item.label}
        src={`https://imageserver.eveonline.com/Type/${item.value}_1024.png`}
      />
      <ItemCardDelete onClick={deleteItem}>
        <img alt="Delete item" width="24" height="24" src="img/remove.svg" />
      </ItemCardDelete>
    </ItemCardStyled>
  );
};

export default ItemCard;
