'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _messageUtil = require('../util/messageUtil');

var _messageUtil2 = _interopRequireDefault(_messageUtil);

var _policyMethods2 = require('./policyMethods');

var _policyMethods3 = _interopRequireDefault(_policyMethods2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var actionsPolicy = function (_policyMethods) {
  (0, _inherits3.default)(actionsPolicy, _policyMethods);

  function actionsPolicy(req, config) {
    (0, _classCallCheck3.default)(this, actionsPolicy);

    var _this = (0, _possibleConstructorReturn3.default)(this, (actionsPolicy.__proto__ || Object.getPrototypeOf(actionsPolicy)).call(this));

    var controller = req.options.controller;
    var action = req.options.action;

    // Take find config if no findOne config is provided
    if (action === 'findOne' && !config[controller].findOne && config[controller].find) action = 'find';

    _this.config = config;
    _this.reqRole = req.user ? req.user.role || 'user' : 'guest';
    _this.askedRole = config[controller][action] || config.all;

    _this.container = config[controller];
    _this.policy = config[controller][action];
    _this.policyName = action;

    _this.errorMessages = _messageUtil2.default.generateActionErrorMessages(controller, action, _this.reqRole, _this.askedRole);
    return _this;
  }

  return actionsPolicy;
}(_policyMethods3.default);

exports.default = actionsPolicy;