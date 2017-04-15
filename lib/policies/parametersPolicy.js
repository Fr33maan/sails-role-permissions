'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _messageUtil = require('../util/messageUtil');

var _messageUtil2 = _interopRequireDefault(_messageUtil);

var _policyMethods2 = require('./policyMethods');

var _policyMethods3 = _interopRequireDefault(_policyMethods2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * parameterPolicy
 *
 * @description :: policy used for some blueprint actions (populate, add, remove)
 */

var parametersPolicy = function (_policyMethods) {
  (0, _inherits3.default)(parametersPolicy, _policyMethods);

  function parametersPolicy(req, config) {
    (0, _classCallCheck3.default)(this, parametersPolicy);

    var _this = (0, _possibleConstructorReturn3.default)(this, (parametersPolicy.__proto__ || Object.getPrototypeOf(parametersPolicy)).call(this));

    var controller = req.options.controller;
    var action = req.options.action;

    // Take find config if no findOne config is provided
    if (action === 'findOne' && !config[controller].findOne && config[controller].find) action = 'find';

    _this.action = action;
    var attribute = req.options.alias;

    _this.config = config;
    _this.reqRole = req.user ? req.user.role || 'user' : 'guest';
    _this.askedRole = config[controller][action][attribute] || config.all;

    _this.container = config[controller][action];

    if ((0, _typeof3.default)(_this.container) === 'object') {
      _this.policy = config[controller][action][attribute];
    } else {
      _this.policy = config[controller][action];
    }

    _this.policyName = attribute;

    _this.errorMessages = _messageUtil2.default.generateAttributeErrorMessages(controller, action, attribute, _this.reqRole, _this.askedRole);
    return _this;
  }

  (0, _createClass3.default)(parametersPolicy, [{
    key: 'customPreCheck',
    value: function customPreCheck() {
      // Check if action is something else than add, remove or populate and go to next policy if so - do it as soon as possible
      return this.action !== 'add' && this.action !== 'remove' && this.action !== 'populate';
    }
  }]);
  return parametersPolicy;
}(_policyMethods3.default);

/*
Add to blueprints params =>
remove from blueprints params =>
{
  parentId : "holder model pk",
  id : "model to associate pk"
}
+ req.options.associations[].collection


Destroy blueprints params =>
findOne blueprints params =>
{
  id : "model to destroy pk"
}


populate blueprints params =>
{
  parentId : "holder model pk to populate",
  id : "will be undefined",
}

*/


exports.default = parametersPolicy;