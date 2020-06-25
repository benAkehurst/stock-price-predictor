'use strict';
const mongoose = require('mongoose');
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
  const rawData = await fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stock}&apikey=${process.env.ALPHA_VANTAGE_KEY}&datatype=json`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

  // Converts Data for Brain.js
  const convertedData = await tools.dataConverter(rawData);
  // Call Brain Function for prediction
  const prediction = await predictors.makePrediction(convertedData);
  // Response Handler
  if (prediction) {
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
