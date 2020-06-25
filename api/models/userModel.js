'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: false,
    },
    userActive: {
      type: Boolean,
      default: true,
    },
    isFreeTrail: {
      type: Boolean,
    },
    freeTrailCount: {
      type: Number,
    },
    isAdmin: {
      type: Boolean,
      default: true,
    },
    restaurantId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
