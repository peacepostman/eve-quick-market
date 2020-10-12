import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Line } from "react-chartjs-2";
import map from "lodash/map";
import isFunction from "lodash/isFunction";
import Loader from "./../Loader";
import {
  SystemCardStyled,
  SystemCardDelete,
  SystemCardContent,
  SystemToolTip,
  SystemCardImg,
} from "./SystemCard.styled";
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
  const [tooltipData, setTooltipData] = useState<any>({});
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const chartRef = useRef<any>(null);
  const systemCardRef = useRef<any>(null);

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

  return (
    <SystemCardStyled
      ref={systemCardRef}
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
                    width={350}
                    ref={chartRef}
                    data={{
                      labels: map(
                        stats[system.value][currentItem.value].history,
                        "date"
                      ),
                      datasets: [
                        {
                          label: "Lowest value",
                          fill: false,
                          lineTension: 0.1,
                          backgroundColor: "rgba(255,255,255,0.6)",
                          borderWidth: 1,
                          borderColor: "rgba(255,255,255,.6)",
                          borderCapStyle: "butt",
                          borderDash: [],
                          borderDashOffset: 0.0,
                          borderJoinStyle: "miter",
                          pointBorderColor: "rgba(255,255,255,.6)",
                          pointBackgroundColor: "rgba(255,255,255,.6)",
                          pointBorderWidth: 1,
                          pointHoverRadius: 5,
                          pointHoverBackgroundColor: "rgba(255,255,255,.6)",
                          pointHoverBorderWidth: 1,
                          pointRadius: 1,
                          pointHitRadius: 10,
                          data: map(
                            stats[system.value][currentItem.value].history,
                            "lowest"
                          ),
                        },
                      ],
                    }}
                    options={{
                      layout: {
                        padding: {
                          left: 0,
                          right: 0,
                          top: 5,
                          bottom: 5,
                        },
                      },
                      legend: {
                        display: false,
                      },
                      scales: {
                        xAxes: [
                          {
                            gridLines: {
                              tickMarkLength: 0,
                              display: false,
                            },
                            ticks: {
                              display: false,
                            },
                          },
                        ],
                        yAxes: [
                          {
                            gridLines: {
                              tickMarkLength: 0,
                              display: false,
                            },
                            ticks: {
                              display: false,
                            },
                          },
                        ],
                      },
                      tooltips: {
                        enabled: false,
                        mode: "x",
                        intersect: false,
                        custom: (tooltipModel: any) => {
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
                          const left =
                            position.left +
                            tooltipModel.caretX -
                            (index > 5 ? 180 : 0);
                          const top = position.top + tooltipModel.caretY + 5;

                          if (
                            tooltipData.index !==
                              tooltipModel.dataPoints[0].index &&
                            tooltipModel.dataPoints[0].left !== left &&
                            tooltipModel.dataPoints[0].top !== top
                          ) {
                            setPositionAndData({
                              top,
                              left,
                              index,
                            });
                          }
                        },
                      },
                    }}
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
                        Lowest price:{" "}
                        <strong>
                          {formatCurrency(
                            stats[system.value][currentItem.value].history[
                              tooltipData.index
                            ].lowest
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
                          return index < 3 ? (
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
