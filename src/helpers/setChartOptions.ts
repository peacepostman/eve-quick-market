export default function (custom: any) {
  return {
    maintainAspectRatio: false,
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
      mode: 'x',
      intersect: false,
      custom,
    },
  };
}
