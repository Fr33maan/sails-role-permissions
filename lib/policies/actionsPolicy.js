'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (req, config) {

  var controller = req.options.controller;
  var action = req.options.action;

  var reqRole = req.user ? req.user.role || 'user' : 'guest';
  var askedRole = config[controller][action] || config.all;

  var actionConfig = config[controller][action];

  var errorMessages = _messageUtil2.default.generateActionErrorMessages(controller, action, reqRole, askedRole);

  // ------------------
  // ----- OBJECT -----
  // ------------------

  // config[controller][action] is an object (means that we must use lower level policy)
  if (_typeof(config[controller][action]) === 'object') return false; //Pending


  // ------------------
  // ---- BOOLEAN -----
  // ------------------

  // Bypass if policy is "true" or if wildcard is true and no controller[action] policy exists
  if (config[controller][action] === true || config.all === true && !(action in config[controller])) return true; //Allow

  // If wildcard is deny and there is no config for the asked controller[action]
  if (config.all === false && !(action in config[controller])) {
    throw new Error(errorMessages.notFound); //Deny
  }

  // If controller[action] policy is set to false
  if (config[controller][action] === false) {
    throw new Error(errorMessages.setToFalse); //Deny
  }

  // ------------------
  // ----- STRING -----
  // ------------------

  // Wildcard is a role
  // Check if role exists and if controller[action] has no policy we use wildcard
  if (typeof config.all === 'string' && _roleUtil2.default.roleExists(config.all, config.roles) && !config[controller][action]) {
    if (_roleUtil2.default.isRoleAllowed(reqRole, config.all, config.roles)) {
      return true;
    } else {
      throw new Error(errorMessages.roleIsTooLow);
    }
  }

  // If config.role is guest we only allow guest to access
  if (askedRole === 'guest') {
    if (reqRole === 'guest') {
      return true; //Allow
    } else {
      throw new Error(errorMessages.setToGuest); //Deny
    }
  }

  // Deny guests
  if (reqRole === 'guest' && askedRole !== 'guest') {
    throw new Error(errorMessages.forbiddenForGuests); //Deny
  }

  // user has not role sufficient to access ressource
  if (_roleUtil2.default.isRoleAllowed(reqRole, askedRole, config.roles)) {
    return true;
  } else {
    throw new Error(errorMessages.roleIsTooLow); // Deny
  }

  return false; //Pending - call next policy
};

var _roleUtil = require('../util/roleUtil');

var _roleUtil2 = _interopRequireDefault(_roleUtil);

var _messageUtil = require('../util/messageUtil');

var _messageUtil2 = _interopRequireDefault(_messageUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }