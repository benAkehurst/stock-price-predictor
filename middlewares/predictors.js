const brain = require('brain.js');

exports.makePrediction = async (data) => {
  // find lowest close in whole data set and set as normalizing number
  const lowestClose = data.reduce((prev, curr) => {
    return prev.close < curr.close ? prev : curr;
  });

  // Make training data
  const scaledData = data.map(scaleDown);

  // Splits all training data into smaller chunks
  const trainingData = [
    scaledData.slice(0, 5),
    scaledData.slice(5, 10),
    scaledData.slice(10, 15),
    scaledData.slice(15, 20),
    scaledData.slice(20, 25),
    scaledData.slice(25, 30),
    scaledData.slice(30, 35),
    scaledData.slice(35, 40),
    scaledData.slice(40, 45),
    scaledData.slice(45, 50),
    scaledData.slice(50, 55),
    scaledData.slice(55, 60),
    scaledData.slice(60, 65),
    scaledData.slice(65, 70),
    scaledData.slice(70, 75),
    scaledData.slice(75, 80),
    scaledData.slice(80, 85),
    scaledData.slice(85, 90),
    scaledData.slice(90, 95),
    scaledData.slice(95, 100),
  ];

  // Making neural net to take 4 inputs
  const net = new brain.recurrent.LSTMTimeStep({
    inputSize: 4,
    hiddenLayers: [8, 8],
    outputSize: 4,
  });

  // Train the data
  net.train(trainingData, {
    learningRate: 0.005,
    errorThresh: 0.02,
    // log: (stats) => console.log(stats),
  });

  // Forecast the next share price
  const prediction = net
    .forecast([trainingData[0][0], trainingData[0][1]], 1)
    .map(scaleUp);

  return prediction;

  // divide by lowest close number in data set
  function scaleDown(step) {
    return {
      open: step.open / lowestClose.close,
      high: step.high / lowestClose.close,
      low: step.low / lowestClose.close,
      close: step.low / lowestClose.close,
    };
  }

  // multiply by smallest close data to get real prediction numbers
  function scaleUp(step) {
    return {
      open: step.open * lowestClose.close,
      high: step.high * lowestClose.close,
      low: step.low * lowestClose.close,
      close: step.low * lowestClose.close,
    };
  }
};
