'use strict';
module.exports = (app) => {
  const stocksController = require('../controllers/stocksController');
  app.route('/api/stocks/test').get(stocksController.test);
};
