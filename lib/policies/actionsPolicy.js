'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _messageUtil = require('../util/messageUtil');

var _messageUtil2 = _interopRequireDefault(_messageUtil);

var _policyMethods2 = require('./policyMethods');

var _policyMethods3 = _interopRequireDefault(_policyMethods2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var actionsPolicy = function (_policyMethods) {
  _inherits(actionsPolicy, _policyMethods);

  function actionsPolicy(req, config) {
    _classCallCheck(this, actionsPolicy);

    var _this = _possibleConstructorReturn(this, (actionsPolicy.__proto__ || Object.getPrototypeOf(actionsPolicy)).call(this));

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