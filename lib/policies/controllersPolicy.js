'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, res, injectedSails) {

  var _sails = sails || injectedSails;
  var config = _sails.config.permissions;
  var controller = req.options.controller;

  if (!config.all && !config[controller]) {
    throw new Error('global permissions set to false and controller has no permissions set');
  }
};