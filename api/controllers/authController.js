'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const middleware = require('../../middlewares/middleware');
const User = mongoose.model('User');

/**
 * Creates a new user object in the DB
 * POST:
 * {
 *  "name": "null", (name is optional)
 *  "email": "test@test.com",
 *  "password": "test"
 *  "telephone": "1112223334"
 * }
 */
exports.create_new_user = (req, res) => {
  const name = req.body.name ? req.body.name : '';
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);
  const telephone = req.body.telephone;

  let newUser = new User({
    name: name,
    email: email,
    password: password,
    telephone: telephone,
    isFreeTrail: true,
    freeTrailCount: 30,
    isAdmin: false,
  });

  newUser.save((err, user) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: 'Error creating new user',
        data: err,
      });
    } else {
      res.status(201).json({
        success: true,
        message: 'User created',
        data: null,
      });
    }
  });
};

/**
 * Logs a user in
 * POST:
 * {
 *  "email": "test@test.com",
 *  "password": "test"
 * }
 */
exports.login_user = (req, res) => {
  let data = req.body;
  User.findOne({ email: data.email }, (err, user) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred',
        data: err,
      });
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Login failed',
        data: {
          message: 'Invalid login credentials',
        },
      });
    }
    if (!bcrypt.compareSync(data.password, user.password)) {
      return res.status(401).json({
        success: false,
        message: 'Login failed',
        data: {
          message: 'Invalid login credentials',
        },
      });
    }
    if (user.userActive === false) {
      return res.status(401).json({
        success: false,
        message: 'Login failed',
        data: {
          message: 'Invalid Account',
        },
      });
    }
    let token = jwt.sign({ username: user._id }, process.env.JWT_SECRET, {
      // TODO: SET JWT TOKEN DURATION HERE
      expiresIn: '24h',
    });
    let userFiltered = _.pick(user.toObject(), [
      'name',
      'email',
      '_id',
      'restaurantId',
      'isAdmin',
      'isFreeTrail',
      'freeTrailCount',
    ]);
    userFiltered.token = token;
    res.cookie('token', token, { expiresIn: '24h' });
    res.status(200).json({
      success: true,
      message: 'Successfully logged in',
      data: userFiltered,
    });
  });
};

/**
 * Resets user password
 * POST:
 * params: userId
 * {
 *  "newPassword": "anything",
 * }
 */
exports.reset_password = async (req, res) => {
  const userId = req.params.userId;
  const newPassword = bcrypt.hashSync(req.body.newPassword, 10);
  if (!userId || userId === null) {
    res.status(400).json({
      success: false,
      message: 'Incorrect Request Parameters',
      data: null,
    });
  }
  User.findByIdAndUpdate(
    userId,
    { $set: { password: newPassword } },
    (err, user) => {
      if (err) {
        res.status(404).json({
          success: false,
          message: 'Error updating password',
          data: err,
        });
      }
      let userFiltered = _.pick(user.toObject(), [
        'name',
        'email',
        '_id',
        'restaurantId',
      ]);
      res.status(200).json({
        success: true,
        message: 'Password Updated',
        data: userFiltered,
      });
    }
  );
};

/**
 * Checks if a token is valid
 * GET
 * params: token
 */
exports.check_token_valid = async (req, res) => {
  const token = req.params.token;
  if (!token || token === null) {
    res.status(400).json({
      success: false,
      message: 'Incorrect Request Parameters',
      data: null,
    });
  }
  let tokenValid;
  await middleware
    .checkToken(token)
    .then((promiseResponse) => {
      if (promiseResponse.success) {
        tokenValid = true;
      }
    })
    .catch((promiseError) => {
      if (promiseError) {
        return res.status(500).json({
          success: false,
          message: 'Bad Token',
          data: null,
        });
      }
    });
  if (tokenValid) {
    res.status(200).json({
      success: true,
      message: 'Token Valid',
      data: null,
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Token not valid',
    });
  }
};

/**
 * Checks if a user is admin
 * GET
 * params: userId
 */
exports.check_user_is_admin = async (req, res) => {
  const userId = req.params.userId;
  if (!userId || userId === null) {
    res.status(400).json({
      success: false,
      message: 'Incorrect Request Parameters',
      data: null,
    });
  }
  let isAdmin;
  User.findById(userId, (err, user) => {
    if (err) {
      res.status(404).json({
        success: false,
        message: 'Error finding user',
        data: err,
      });
    }
    if (!user.isAdmin) {
      res.status(400).json({
        success: false,
        message: 'User not valid',
        data: null,
      });
    }
    if (user.isAdmin) {
      isAdmin = isAdmin;
      res.status(200).json({
        success: true,
        message: 'User valid',
        data: null,
      });
    }
  });
};
