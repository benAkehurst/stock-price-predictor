const moment = require('moment');

exports.dataConverter = async (rawData) => {
  // Extract only stock data
  const timeSeriesData = rawData['Time Series (Daily)'];
  // make array only stock price data
  const onlyTimeSeriesData = Object.keys(timeSeriesData).map((timestamp) => {
    return timeSeriesData[timestamp];
  });
  // convert object keys to
  const convertedKeys = onlyTimeSeriesData.map(
    ({
      '1. open': open,
      '2. high': high,
      '3. low': low,
      '4. close': close,
    }) => ({
      open,
      high,
      low,
      close,
    })
  );
  // convert all strings to numbers - parseFloat()
  const convertedValues = convertedKeys.map((item) => {
    return Object.assign(item, {
      open: parseFloat(item.open),
      high: parseFloat(item.high),
      low: parseFloat(item.low),
      close: parseFloat(item.close),
    });
  });
  return convertedValues;
};

exports.autoCompleteConverter = async (rawData) => {
  const convertedKeys = rawData.bestMatches.map(
    ({ '1. symbol': symbol, '2. name': name }) => ({
      symbol,
      name,
    })
  );
  return convertedKeys;
};

exports.convertDataForComparison = async (rawData, time) => {
  const formattedTime = moment(time).format('yyyy-MM-DD');
  const timeSeriesData = rawData['Time Series (Daily)'];
  const convertedArray = Object.entries(timeSeriesData).map((e) => ({
    date: e[0],
    data: e[1],
  }));
  const match = convertedArray.filter((item) => item.date === formattedTime);
  return match;
};
