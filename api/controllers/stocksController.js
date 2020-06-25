'use strict';
const mongoose = require('mongoose');
const predictors = require('../../middlewares/predictors');

/**
 * TEST METHOD
 * GET:
 */
exports.test = (req, res) => {
  let a = predictors.a();
  res.status(201).json({
    success: true,
    message: 'User created',
    data: a,
  });
};
