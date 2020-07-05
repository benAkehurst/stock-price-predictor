'use strict';
const mongoose = require('mongoose');
const Stock = mongoose.model('Stock');
const fetch = require('node-fetch');
const predictors = require('../../middlewares/predictors');
const tools = require('../../middlewares/tools');

/**
 * Get Stock Prediction
 * GET:
 * param: stock - stock symbol
 */
exports.get_stock_prediction = async (req, res) => {
  const stock = req.params.stock;

  // Fetches Raw Stock Data
  const rawData = await fetchRawData(stock);

  // Converts Data for Brain.js
  const convertedData = await tools.dataConverter(rawData);
  // Call Brain Function for prediction
  const prediction = await predictors.makePrediction(convertedData);
  // Response Handler
  if (prediction) {
    // Save response to DB
    let response = new Stock({
      stockSymbol: stock,
      data: prediction,
    });
    response.save();
    // Send response to user
    res.status(200).json({
      success: true,
      message: 'Prediction made successfully!',
      data: prediction,
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Prediction failed',
      data: null,
    });
  }
};

/**
 * Gets auto complete options
 * GET
 * param: searchValue
 */
exports.get_autocomplete_options = async (req, res) => {
  const searchValue = req.params.searchValue;

  // Fetches Raw Stock Data
  const rawData = await fetch(
    `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchValue}&apikey=${process.env.ALPHA_VANTAGE_KEY}&datatype=json`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

  const convertedData = await tools.autoCompleteConverter(rawData);
  if (convertedData.length > 0) {
    res.status(200).json({
      success: true,
      message: 'Autocomplete success',
      data: convertedData,
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Autocomplete failed',
      data: null,
    });
  }
};

/**
 * Gets all the predictions
 * GET
 */
exports.get_all_predictions = async (req, res) => {
  let predictions = await Stock.find({}, (err, predictions) => {
    if (err) {
      return err;
    } else {
      return predictions;
    }
  });
  if (!predictions) {
    res.status(404).json({
      success: false,
      message: 'Failed to get all predictions',
      data: null,
    });
  } else {
    res.status(200).json({
      success: true,
      message: 'Predictions found successfully',
      data: predictions,
    });
  }
};

/**
 * Compares prediction
 * GET
 */
exports.compare_prediction_and_result = async (req, res) => {
  const predictionId = req.params.predictionId;
  let prediction = await Stock.findById(predictionId, (err, item) => {
    if (err) {
      return err;
    } else {
      return item;
    }
  });

  if (!prediction) {
    res.status(404).json({
      success: false,
      message: 'Failed to get prediction comparison',
      data: null,
    });
  } else {
    const rawData = await fetchRawData(prediction.stockSymbol);
    const outcome = await tools.convertDataForComparison(
      rawData,
      prediction.createdAt
    );
    const resObj = {
      symbol: prediction.stockSymbol,
      prediction: prediction.data,
      actualOutcome: outcome[0].data,
    };
    res.status(200).json({
      success: true,
      message: 'Comparison made successfully',
      data: resObj,
    });
  }
};

async function fetchRawData(stockSymbol) {
  return await fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockSymbol}&apikey=${process.env.ALPHA_VANTAGE_KEY}&datatype=json`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}
