'use strict';
module.exports = (app) => {
  const stocksController = require('../controllers/stocksController');
  app
    .route('/api/stocks/get-stock-prediction/:stock')
    .get(stocksController.get_stock_prediction);
};
