'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (req, config) {

  var controller = req.options.controller;

  // ------------------
  // ----- OBJECT -----
  // ------------------

  // config[controller] is an object (means that we must use lower level policy)
  if (_typeof(config[controller]) === 'object') return false; //Pending


  // ------------------
  // ---- BOOLEAN -----
  // ------------------

  // Bypass if policy is "true" or if all is true and no controller policy exists
  if (config[controller] === true || config.all === true && !(controller in config)) return true; //Allow

  // If config.all is deny and there is no config for the asked controller
  if (config.all === false && !(controller in config)) {
    throw new Error(_errorMessages.controllerNotFound); //Deny
  }

  // If controller policy is set to false
  if (config[controller] === false) {
    throw new Error(_errorMessages.controllerNotAllowed + 'controller policy set to false'); //Deny
  }

  // ------------------
  // ----- STRING -----
  // ------------------

  var askedRole = config[controller];
  var userRole = req.user ? req.user.role || 'user' : 'guest';

  // If config.role is guest we only allow guest to access
  if (askedRole === 'guest') {
    if (userRole === 'guest') {
      return true; //Allow
    } else {
      throw new Error(_errorMessages.controllerNotAllowed + 'asked role is guest and req is ' + userRole); //Deny
    }
  }

  // Deny guests
  if (userRole === 'guest' && askedRole !== 'guest') {
    throw new Error(_errorMessages.controllerNotAllowed + 'guest are not allowed'); //Deny
  }

  // user has not role sufficient to access ressource
  if (_roleUtil2.default.isRoleAboveLimit(userRole, askedRole, config.roles)) {
    throw new Error(_errorMessages.controllerNotAllowed + 'asked role is above user permission');
  }

  return false; //Pending - call next policy
};

var _errorMessages = require('../config/errorMessages');

var _roleUtil = require('../util/roleUtil');

var _roleUtil2 = _interopRequireDefault(_roleUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }