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

var controllersPolicy = function (_policyMethods) {
  _inherits(controllersPolicy, _policyMethods);

  function controllersPolicy(req, config) {
    _classCallCheck(this, controllersPolicy);

    var _this = _possibleConstructorReturn(this, (controllersPolicy.__proto__ || Object.getPrototypeOf(controllersPolicy)).call(this));

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