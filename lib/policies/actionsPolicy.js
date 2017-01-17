'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, config) {

  var controller = req.options.controller;

  if (config.all === false && !(controller in config)) {
    throw new Error(_errorMessages.controllerNotFound);
  }

  if (config[controller] === false) {
    throw new Error(_errorMessages.controllerNotAllowed + 'controller policy set to false');
  }

  return true;
};

var _errorMessages = require('../config/errorMessages');