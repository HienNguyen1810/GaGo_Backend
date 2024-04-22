'use strict';

const pgManager = require('./pgManager');

const searchMap = require('./google.geolocation.js');
module.exports = {
  pgManager,
  geolocation: searchMap,
};