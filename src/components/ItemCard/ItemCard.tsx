import React from "react";
import { ItemCardStyled, ItemCardDelete, ItemName } from "./ItemCard.styled";

interface Props {
  item: any;
  select(item: any): void;
  currentItem: any;
  deleteItem?(system: any): void;
}

const ItemCard = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { item, select, currentItem, deleteItem } = props;
  const selected =
    currentItem && currentItem !== null && currentItem.value === item.value;
  return (
    <ItemCardStyled ref={ref} selected={selected} onClick={() => select(item)}>
      <img
        alt={item.label}
        src={`https://images.evetech.net/types/${item.value}/${item.image_type}?size=1024`}
      />
      <ItemCardDelete onClick={deleteItem}>
        <img alt="Delete item" width="24" height="24" src="img/remove.svg" />
      </ItemCardDelete>
      <ItemName>{item.label}</ItemName>
    </ItemCardStyled>
  );
});

export default ItemCard;
