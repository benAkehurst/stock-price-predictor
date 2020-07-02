'use strict';
module.exports = (app) => {
  const stocksController = require('../controllers/stocksController');
  app
    .route('/api/stocks/get-stock-prediction/:stock')
    .get(stocksController.get_stock_prediction);

  app
    .route('/api/stocks/get-autocomplete-values/:searchValue')
    .get(stocksController.get_autocomplete_options);

  app
    .route('/api/stocks/get-all-predictions/')
    .get(stocksController.get_all_predictions);
};
