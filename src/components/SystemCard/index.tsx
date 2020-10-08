import React, { useState } from "react";
import Loader from "./../Loader";
import {
  SystemCardStyled,
  SystemCardDelete,
  SystemCardContent,
  SystemCardImg,
} from "./index.styled";
import formatCurrency from "./../../helpers/formatCurrency";

interface Props extends React.HTMLProps<HTMLButtonElement> {
  system?: any;
  currentItem?: any;
  stats?: any;
  loading?: boolean;
  lowest?: boolean;
  highest?: boolean;
  deleteSystem?(system: any): void;
}

const SystemCard = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    system,
    deleteSystem,
    currentItem,
    stats,
    loading,
    lowest,
    highest,
  } = props;
  const [image] = useState(Math.floor(Math.random() * 6) + 1);

  return (
    <SystemCardStyled
      ref={ref}
      noImage={!system}
      lowest={lowest}
      data-lowest={lowest}
      highest={highest}
      data-highest={highest}
    >
      {system ? (
        <>
          <SystemCardImg
            alt={system.label}
            lowest={lowest}
            highest={highest}
            src={"img/" + image + ".jpg"}
          />
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
                  {formatCurrency(
                    stats[system.value][currentItem.value].sell.min
                  )}
                </li>
                <li>
                  median:{" "}
                  {formatCurrency(
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
});

export default SystemCard;
