'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, res, next) {

  function wrapper(fn) {
    return fn(req);
  }

  (0, _modelsPolicy2.default)(req).then(wrapper(_actionsPolicy2.default)).then(next);
};

var _modelsPolicy = require('./modelsPolicy');

var _modelsPolicy2 = _interopRequireDefault(_modelsPolicy);

var _actionsPolicy = require('./actionsPolicy');

var _actionsPolicy2 = _interopRequireDefault(_actionsPolicy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }