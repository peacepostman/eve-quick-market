import React, { useState } from "react";
import Loader from "./../Loader";
import {
  SystemCardStyled,
  SystemCardDelete,
  SystemCardContent,
  SystemCardImg,
} from "./index.styled";

interface Props {
  system?: any;
  currentItem?: any;
  stats?: any;
  loading?: boolean;
  deleteSystem?(system: any): void;
}

function toCurrencyString(number: number) {
  return Number(number)
    .toFixed(2)
    .replace(/(\d)(?=(\d{3})+\b)/g, "$1 ");
}

function toCurrencyQtyString(number: number) {
  return Number(number)
    .toFixed(0)
    .replace(/(\d)(?=(\d{3})+\b)/g, "$1 ");
}

const SystemCard: React.FC<Props> = (props) => {
  const { system, deleteSystem, currentItem, stats, loading } = props;
  const [image] = useState(Math.floor(Math.random() * 6) + 1);
  return (
    <SystemCardStyled noImage={!system}>
      {system ? (
        <>
          <SystemCardImg alt={system.label} src={"img/" + image + ".jpg"} />
          <SystemCardDelete onClick={deleteSystem}>
            <img
              alt="Delete system"
              width="24"
              height="24"
              src="img/remove.svg"
            />
          </SystemCardDelete>
        </>
      ) : null}
      <SystemCardContent>
        {system ? (
          <>
            <h3>{system.label}</h3>
            {loading ? (
              <Loader />
            ) : currentItem &&
              currentItem.value &&
              stats &&
              stats[system.value] ? (
              <ul>
                <li>
                  Min:{" "}
                  {toCurrencyString(
                    stats[system.value][currentItem.value].sell.min
                  )}
                </li>
                <li>
                  median:{" "}
                  {toCurrencyString(
                    stats[system.value][currentItem.value].sell.median
                  )}
                </li>
                <li>
                  volume: {stats[system.value][currentItem.value].sell.volume}
                </li>
                <li>
                  total orders:{" "}
                  {stats[system.value][currentItem.value].sell.orderCount}
                </li>
              </ul>
            ) : null}
          </>
        ) : (
          props.children
        )}
      </SystemCardContent>
    </SystemCardStyled>
  );
};

export default SystemCard;
