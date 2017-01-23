'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, res, next, injectedConfig) {

  var config = sails ? sails.config.permissions : injectedConfig;

  try {
    if (new _controllersPolicy2.default(req, config).check()) return next(); //Bypass other policies if policy returns true
    if (new _actionsPolicy2.default(req, config).check()) return next();
    if (new _parametersPolicy2.default(req, config).check()) return next();

    // check attributes -> set filters

    // check find / create
    // apply filters before / after

    // caching

    throw new Error('request has not been explicitely allowed and this might be a security issue -> Access Denied');
  } catch (e) {
    res.forbidden(e);
  }
};

var _controllersPolicy = require('./controllersPolicy');

var _controllersPolicy2 = _interopRequireDefault(_controllersPolicy);

var _actionsPolicy = require('./actionsPolicy');

var _actionsPolicy2 = _interopRequireDefault(_actionsPolicy);

var _parametersPolicy = require('./parametersPolicy');

var _parametersPolicy2 = _interopRequireDefault(_parametersPolicy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }