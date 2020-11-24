import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Line } from "react-chartjs-2";
import map from "lodash/map";
import isFunction from "lodash/isFunction";
import Loader from "./../Loader";
import {
  SystemCardStyled,
  SystemCardDelete,
  SystemCardAnomaly,
  SystemCardContent,
  SystemToolTip,
  SystemCardImg,
} from "./SystemCard.styled";
import formatCurrency from "./../../helpers/formatCurrency";
import setChartData from "./../../helpers/setChartData";
import setChartOptions from "./../../helpers/setChartOptions";

interface Props extends React.HTMLProps<HTMLButtonElement> {
  system?: any;
  currentItem?: any;
  stats?: any;
  loading?: boolean;
  lowest?: boolean;
  highest?: boolean;
  deleteSystem?(system: any): void;
  openSystemAnomaly?(e: any, system: any): void;
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
    openSystemAnomaly,
  } = props;
  const [image] = useState(Math.floor(Math.random() * 6) + 1);
  const [tooltipData, setTooltipData] = useState<any>({});
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const chartRef = useRef<any>(null);
  const systemCardRef = useRef<any>(null);
  const isRetina = window.devicePixelRatio > 1;

  useLayoutEffect(() => {
    if (ref) {
      if (isFunction(ref)) {
        ref(systemCardRef.current);
      } else {
        (ref as any).current = systemCardRef.current;
      }
    }
  }, [systemCardRef]);

  useEffect(() => {
    function hideTooltip() {
      setShowTooltip(false);
    }
    document.addEventListener("scroll", hideTooltip);
    systemCardRef.current.parentElement.addEventListener("scroll", hideTooltip);
    return () => {
      document.removeEventListener("scroll", hideTooltip);
      systemCardRef.current.parentElement.removeEventListener(
        "scroll",
        hideTooltip
      );
    };
  }, []);

  const setPositionAndData = (data: any) => {
    setTooltipData(data);
  };

  const tooltipCustom = (tooltipModel: any) => {
    // if chart is not defined, return early
    const chart = chartRef.current;
    if (!chart) {
      return;
    }

    if (tooltipModel.opacity === 0) {
      setShowTooltip(false);
      return;
    } else if (!showTooltip) {
      setShowTooltip(true);
    }

    const index = tooltipModel.dataPoints[0].index;
    const position = chart.chartInstance.canvas.getBoundingClientRect();
    const left = position.left + tooltipModel.caretX - (index > 5 ? 180 : 0);
    const top = position.top + tooltipModel.caretY + 5;

    if (
      tooltipData.index !== tooltipModel.dataPoints[0].index &&
      tooltipModel.dataPoints[0].left !== left &&
      tooltipModel.dataPoints[0].top !== top
    ) {
      setPositionAndData({
        top,
        left,
        index,
      });
    }
  };

  return (
    <SystemCardStyled
      ref={systemCardRef}
      noImage={!system}
      lowest={lowest}
      data-lowest={lowest}
      highest={highest}
      data-highest={highest}
      data-id={system ? system.value : 0}
    >
      {system ? (
        <>
          <SystemCardImg
            alt={system.label}
            lowest={lowest}
            highest={highest}
            src={"img/" + image + ".jpg"}
          />
          <SystemCardAnomaly
            onClick={(e) =>
              openSystemAnomaly ? openSystemAnomaly(e, system) : null
            }
          >
            $
          </SystemCardAnomaly>
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
              <div style={{ margin: "20px 0", height: "200px" }}>
                <Loader color="rgba(255, 255, 255, .6)" />
              </div>
            ) : currentItem &&
              currentItem.value &&
              stats &&
              stats[system.value] &&
              stats[system.value][currentItem.value] ? (
              <>
                <div className="system-card-graph">
                  <Line
                    height={80}
                    width={isRetina ? 350 : 250}
                    ref={chartRef}
                    data={setChartData(
                      map(
                        stats[system.value][currentItem.value].history,
                        "date"
                      ),
                      map(
                        stats[system.value][currentItem.value].history,
                        "average"
                      )
                    )}
                    options={setChartOptions(tooltipCustom)}
                  />
                  {showTooltip && tooltipData.index >= 0 ? (
                    <SystemToolTip
                      style={{ top: tooltipData.top, left: tooltipData.left }}
                    >
                      <div>
                        <strong style={{ display: "block" }}>
                          {
                            stats[system.value][currentItem.value].history[
                              tooltipData.index
                            ].date
                          }
                        </strong>
                        Average price:{" "}
                        <strong>
                          {formatCurrency(
                            stats[system.value][currentItem.value].history[
                              tooltipData.index
                            ].average
                          )}
                        </strong>
                      </div>
                      <div>
                        Volume:{" "}
                        <strong>
                          {formatCurrency(
                            stats[system.value][currentItem.value].history[
                              tooltipData.index
                            ].volume
                          )}
                        </strong>
                      </div>
                      <div>
                        Total order:{" "}
                        <strong>
                          {formatCurrency(
                            stats[system.value][currentItem.value].history[
                              tooltipData.index
                            ].order_count
                          )}
                        </strong>
                      </div>
                    </SystemToolTip>
                  ) : null}
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats[system.value][currentItem.value].orders.length >
                    0 ? (
                      stats[system.value][currentItem.value].orders.map(
                        (order: any, index: number) => {
                          return index < 2 ? (
                            <tr key={index}>
                              <td>{formatCurrency(order.volume_remain)}</td>
                              <td>{formatCurrency(order.price)} ISK</td>
                            </tr>
                          ) : null;
                        }
                      )
                    ) : (
                      <>
                        <tr>
                          <td colSpan={2}>&nbsp;</td>
                        </tr>
                        <tr>
                          <td colSpan={2} style={{ textAlign: "center" }}>
                            No sell orders
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}>&nbsp;</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </>
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
