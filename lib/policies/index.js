'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, res, next, injectedConfig) {

  var config = sails ? sails.config.permissions : injectedConfig;

  function wrapper(fn) {
    return fn(req, res, config);
  }

  try {
    if ((0, _controllersPolicy2.default)(req, config)) return next(); //Bypass other policies if policy returns true

    next();
  } catch (e) {
    res.forbidden(e);
  }
};

var _controllersPolicy = require('./controllersPolicy');

var _controllersPolicy2 = _interopRequireDefault(_controllersPolicy);

var _actionsPolicy = require('./actionsPolicy');

var _actionsPolicy2 = _interopRequireDefault(_actionsPolicy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }