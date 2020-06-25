'use strict';
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const predictors = require('../../middlewares/predictors');
const tools = require('../../middlewares/tools');

/**
 * TEST METHOD
 * GET:
 */
exports.get_stock_prediction = async (req, res) => {
  const stock = req.params.stock;

  // Fetches Raw Stock Data
  let rawData = await fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stock}&apikey=${process.env.ALPHA_VANTAGE_KEY}&datatype=json`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

  // Converts Data for Brain.js
  const convertedData = tools.dataConverter(rawData);

  res.status(200).json({
    success: true,
    message: 'Data received',
    data: convertedData,
  });
};
