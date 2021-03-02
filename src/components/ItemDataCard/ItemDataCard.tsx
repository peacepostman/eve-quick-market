import React, { useState, useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import includes from 'lodash/includes';
import {
  ItemCardStyled,
  ItemCardContentWrapper,
  ItemCardContent,
  ItemCardContentInner,
  ItemCardStatWrapper,
  ItemCardToolTip,
  ItemCardImageWrapper,
  ItemCardImageContent,
  ItemCardImageBlurred,
  ItemCardImageSquare,
} from './ItemDataCard.styled';
import formatCurrency from './../../helpers/formatCurrency';
import setChartData from './../../helpers/setChartData';
import setChartOptions from './../../helpers/setChartOptions';

interface Props extends React.HTMLProps<HTMLButtonElement> {
  currentItem?: any;
}

const SystemCard = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { currentItem } = props;
  const [tooltipData, setTooltipData] = useState<any>({});
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    function hideTooltip() {
      setShowTooltip(false);
    }

    document.addEventListener('scroll', hideTooltip);
    return () => {
      document.removeEventListener('scroll', hideTooltip);
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
    //const position = chart.chartInstance.canvas.getBoundingClientRect();
    const left = tooltipModel.caretX - (index > 7 ? 180 : 0);
    const top = tooltipModel.caretY + 5;

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

  return currentItem ? (
    <ItemCardStyled>
      <ItemCardImageWrapper>
        <ItemCardImageBlurred
          style={{
            backgroundImage: `url(https://images.evetech.net/types/${currentItem.sell.type_id}/${currentItem.infos.image_type}?size=64)`,
          }}
        ></ItemCardImageBlurred>
        <ItemCardImageContent>
          {!includes(currentItem.infos.label.toLowerCase(), 'skin') ? (
            <ItemCardImageSquare
              alt={currentItem.infos.label}
              src={`https://images.evetech.net/types/${currentItem.sell.type_id}/${currentItem.infos.image_type}?size=64`}
            />
          ) : null}
          <h3>{currentItem.infos.label}</h3>
        </ItemCardImageContent>
      </ItemCardImageWrapper>
      <ItemCardStatWrapper>
        <Line
          height={240}
          ref={chartRef}
          data={setChartData(map(currentItem.median.data, 'date'), map(currentItem.median.data, 'average'))}
          options={setChartOptions(tooltipCustom)}
        />
        <div className="system-card-graph">
          {showTooltip && tooltipData.index >= 0 ? (
            <ItemCardToolTip style={{ top: tooltipData.top, left: tooltipData.left }}>
              <div>
                <strong style={{ display: 'block' }}>{currentItem.median.data[tooltipData.index].date}</strong>
                Average price: <strong>{formatCurrency(currentItem.median.data[tooltipData.index].average)}</strong>
              </div>
              <div>
                Volume: <strong>{formatCurrency(currentItem.median.data[tooltipData.index].volume)}</strong>
              </div>
              <div>
                Total order: <strong>{formatCurrency(currentItem.median.data[tooltipData.index].order_count)}</strong>
              </div>
            </ItemCardToolTip>
          ) : null}
        </div>
        <small>Price evolution on the last 14 active days</small>
      </ItemCardStatWrapper>
      <ItemCardContentWrapper>
        <ItemCardContent>
          <ItemCardContentInner>
            <SimpleBar>
              <h2>Sell orders</h2>
              <table>
                <thead>
                  <tr>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItem.sell_data.length > 0 ? (
                    currentItem.sell_data.map((order: any, index: number) => {
                      return (
                        <tr key={index}>
                          <td>{formatCurrency(order.volume_remain)}</td>
                          <td>{formatCurrency(order.price)} ISK</td>
                        </tr>
                      );
                    })
                  ) : (
                    <>
                      <tr>
                        <td colSpan={2}>&nbsp;</td>
                      </tr>
                      <tr>
                        <td colSpan={2} style={{ textAlign: 'center' }}>
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
            </SimpleBar>
          </ItemCardContentInner>
        </ItemCardContent>

        <ItemCardContent>
          <ItemCardContentInner>
            <SimpleBar>
              <h2>Buy orders</h2>
              <table>
                <thead>
                  <tr>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItem.buy_data.length > 0 ? (
                    currentItem.buy_data.map((order: any, index: number) => {
                      return (
                        <tr key={index}>
                          <td>{formatCurrency(order.volume_remain)}</td>
                          <td>{formatCurrency(order.price)} ISK</td>
                        </tr>
                      );
                    })
                  ) : (
                    <>
                      <tr>
                        <td colSpan={2}>&nbsp;</td>
                      </tr>
                      <tr>
                        <td colSpan={2} style={{ textAlign: 'center' }}>
                          No buy orders
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2}>&nbsp;</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </SimpleBar>
          </ItemCardContentInner>
        </ItemCardContent>
      </ItemCardContentWrapper>
    </ItemCardStyled>
  ) : null;
});

export default SystemCard;
