import mean from 'lodash/mean';
import isWithinInterval from 'date-fns/isWithinInterval';
import subDays from 'date-fns/subDays';
import historyType from './../definitions/history';

export default function averagePerType(data: historyType[], key: keyof historyType) {
  let arrayOfValues: any = [];
  const arrayExpectedLength: number = data.length;
  if (data && data.length > 0) {
    for (var i = 0; i < data.length; i++) {
      const [year, month, day]: any = data[i].date.split('-');
      const parsedDate = new Date(year, month - 1, day);
      if (
        isWithinInterval(parsedDate, {
          start: subDays(new Date(), 15),
          end: new Date(),
        })
      ) {
        arrayOfValues.push(data[i][key]);
      }
    }
    if (arrayOfValues.length < arrayExpectedLength) {
      for (var ii = 0; ii < arrayExpectedLength - arrayOfValues.length; ii++) {
        arrayOfValues.push(0);
      }
    }

    return mean(arrayOfValues);
  } else {
    return 0;
  }
}
