'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockSchema = new Schema(
  {
    stockSymbol: {
      type: String,
    },
    data: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stock', StockSchema);
