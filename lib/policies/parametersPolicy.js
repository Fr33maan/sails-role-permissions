'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _messageUtil = require('../util/messageUtil');

var _messageUtil2 = _interopRequireDefault(_messageUtil);

var _roleUtil = require('../util/roleUtil');

var _roleUtil2 = _interopRequireDefault(_roleUtil);

var _policyMethods2 = require('./policyMethods');

var _policyMethods3 = _interopRequireDefault(_policyMethods2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * parameterPolicy
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @description :: policy used for some blueprint actions (populate, add, remove)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var parametersPolicy = function (_policyMethods) {
  _inherits(parametersPolicy, _policyMethods);

  function parametersPolicy(req, config) {
    _classCallCheck(this, parametersPolicy);

    var _this = _possibleConstructorReturn(this, (parametersPolicy.__proto__ || Object.getPrototypeOf(parametersPolicy)).call(this));

    var action = req.options.action;
    _this.action = action;
    var controller = req.options.controller;
    var attribute = req.options.alias;

    _this.config = config;
    _this.reqRole = req.user ? req.user.role || 'user' : 'guest';
    _this.askedRole = config[controller][action][attribute] || config.all;

    _this.container = config[controller][action];
    _this.policy = config[controller][action][attribute];
    _this.policyName = attribute;

    _this.errorMessages = _messageUtil2.default.generateAttributeErrorMessages(controller, action, attribute, _this.reqRole, _this.askedRole);
    return _this;
  }

  _createClass(parametersPolicy, [{
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