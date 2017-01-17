'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (req, config) {

  var controller = req.options.controller;

  var reqRole = req.user ? req.user.role || 'user' : 'guest';
  var askedRole = config[controller];

  var errorMessages = _messageUtil2.default.generateControllerErrorMessages(controller, reqRole, askedRole);

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
    throw new Error(errorMessages.notFound); //Deny
  }

  // If controller policy is set to false
  if (config[controller] === false) {
    throw new Error(errorMessages.setToFalse); //Deny
  }

  // ------------------
  // ----- STRING -----
  // ------------------

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
    throw new Error(errorMessages.rankIsTooLow); // Deny
  }

  return false; //Pending - call next policy
};

var _roleUtil = require('../util/roleUtil');

var _roleUtil2 = _interopRequireDefault(_roleUtil);

var _messageUtil = require('../util/messageUtil');

var _messageUtil2 = _interopRequireDefault(_messageUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }