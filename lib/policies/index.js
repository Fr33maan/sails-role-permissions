'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, res, next, injectedSails) {

  var _sails = sails || injectedSails;

  function wrapper(fn) {
    return fn(req, res, _sails);
  }

  try {
    (0, _controllersPolicy2.default)(req, res, _sails);

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