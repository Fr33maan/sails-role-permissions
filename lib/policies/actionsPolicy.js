'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _roleUtil = require('../util/roleUtil');

var _roleUtil2 = _interopRequireDefault(_roleUtil);

var _messageUtil = require('../util/messageUtil');

var _messageUtil2 = _interopRequireDefault(_messageUtil);

var _policyMethods2 = require('./policyMethods');

var _policyMethods3 = _interopRequireDefault(_policyMethods2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var parametersPolicy = function (_policyMethods) {
  _inherits(parametersPolicy, _policyMethods);

  function parametersPolicy(req, config) {
    _classCallCheck(this, parametersPolicy);

    var _this = _possibleConstructorReturn(this, (parametersPolicy.__proto__ || Object.getPrototypeOf(parametersPolicy)).call(this));

    var controller = req.options.controller;
    var action = req.options.action;

    _this.config = config;
    _this.reqRole = req.user ? req.user.role || 'user' : 'guest';
    _this.askedRole = config[controller][action] || config.all;

    _this.container = config[controller];
    _this.policy = config[controller][action];
    _this.policyName = action;

    _this.errorMessages = _messageUtil2.default.generateActionErrorMessages(controller, action, _this.reqRole, _this.askedRole);
    return _this;
  }

  return parametersPolicy;
}(_policyMethods3.default);

/*
export default function (req, config) {

  const controller = req.options.controller
  const action = req.options.action

  const reqRole   = req.user ? (req.user.role || 'user') : 'guest'
  const askedRole = config[controller][action] || config.all

  const errorMessages = messageUtil.generateActionErrorMessages(controller, action, reqRole, askedRole)

  // ------------------
  // ----- OBJECT -----
  // ------------------

  // config[controller][action] is an object (means that we must use lower level policy)
  if(typeof config[controller][action] === 'object') return false //Pending



  // ------------------
  // ---- BOOLEAN -----
  // ------------------

  // Bypass if policy is "true" or if wildcard is true and no controller[action] policy exists
  if(config[controller][action] === true || (config.all === true && !(action in config[controller]))) return true //Allow

  // If wildcard is deny and there is no config for the asked controller[action]
  if(config.all === false && !(action in config[controller])){
    throw new Error(errorMessages.notFound) //Deny
  }

  // If controller[action] policy is set to false
  if(config[controller][action] === false){
    throw new Error(errorMessages.setToFalse) //Deny
  }



  // ------------------
  // ----- STRING -----
  // ------------------

  // Wildcard is a role
  // Check if role exists and if controller[action] has no policy we use wildcard
  if(typeof config.all === 'string' && roleUtil.roleExists(config.all, config.roles) && !config[controller][action]){
    if(roleUtil.isRoleAllowed(reqRole, config.all, config.roles)){
      return true

    }else{
      throw new Error(errorMessages.roleIsTooLow)
    }
  }

  // If config.role is guest we only allow guest to access
  if(askedRole === 'guest'){
    if(reqRole === 'guest'){
      return true //Allow

    }else{
      throw new Error(errorMessages.setToGuest) //Deny
    }
  }


  // Deny guests
  if(reqRole === 'guest' && askedRole !== 'guest'){
    throw new Error(errorMessages.forbiddenForGuests) //Deny
  }


  // user has not role sufficient to access ressource
  if(roleUtil.isRoleAllowed(reqRole, askedRole, config.roles)){
    return true

  }else{
    throw new Error(errorMessages.roleIsTooLow) // Deny

  }


  return false //Pending - call next policy
}
*/


exports.default = parametersPolicy;