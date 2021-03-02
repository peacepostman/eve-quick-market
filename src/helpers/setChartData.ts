export default function (labels: any, data: any) {
  return {
    labels,
    datasets: [
      {
        label: 'Lowest value',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,.6)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(255,255,255,.6)',
        pointBackgroundColor: 'rgba(255,255,255,.6)',
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(255,255,255,.6)',
        pointHoverBorderWidth: 1,
        pointRadius: 2,
        pointHitRadius: 10,
        data,
      },
    ],
  };
}
