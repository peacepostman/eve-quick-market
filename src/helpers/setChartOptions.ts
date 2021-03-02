function format(n: any, d: any) {
  let x = ('' + n).length;
  let p = Math.pow;
  d = p(10, d);
  x -= x % 3;
  return Math.round((n * d) / p(10, x)) / d + ' kMBT'[x / 3];
}

export default function (custom: any) {
  return {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 25,
        bottom: 15,
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
            color: 'rgba(255,255,255,.1)',
            tickMarkLength: 0,
            display: true,
          },
          ticks: {
            fontColor: 'rgba(255,255,255,.6)',
            padding: 10,
            display: true,
            callback: (value: any, index: any, values: any) => {
              return format(value, 2);
            },
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
