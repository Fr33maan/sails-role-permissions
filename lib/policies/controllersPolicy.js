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

var controllersPolicy = function (_policyMethods) {
  (0, _inherits3.default)(controllersPolicy, _policyMethods);

  function controllersPolicy(req, config) {
    (0, _classCallCheck3.default)(this, controllersPolicy);

    var _this = (0, _possibleConstructorReturn3.default)(this, (controllersPolicy.__proto__ || Object.getPrototypeOf(controllersPolicy)).call(this));

    var controller = req.options.controller;

    _this.config = config;
    _this.reqRole = req.user ? req.user.role || 'user' : 'guest';
    _this.askedRole = config[controller] || config.all;

    _this.container = config;
    _this.policy = config[controller];
    _this.policyName = controller;

    _this.errorMessages = _messageUtil2.default.generateControllerErrorMessages(controller, _this.reqRole, _this.askedRole);
    return _this;
  }

  return controllersPolicy;
}(_policyMethods3.default);

exports.default = controllersPolicy;