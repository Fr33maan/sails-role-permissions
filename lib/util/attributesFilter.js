'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, config, modelDefinition) {

  var modelName = req.options.controller;

  // Assume that we are in sails environment because we manually inject modelDefinition for testing
  if (!modelDefinition) {
    if (!(modelName in sails.models)) throw new Error('Model (' + modelName + ') not found in sails');

    modelDefinition = sails.models[modelName].definition;
  }

  var controller = req.options.controller;
  var action = req.options.action;
  var container = config[controller][action];

  var reqRole = req.user ? req.user.role || 'user' : 'guest';

  var filters = {
    allowed: [
      // Visible attributes for this user
    ],
    private: [
      // Conditional attributes for this user
    ]
  };

  for (var attribute in modelDefinition) {

    if (attribute in container) {

      var policy = container[attribute];
      var visibility = void 0;

      if (policy === 'private') {
        if (reqRole === 'admin') {
          filters.allowed.push(attribute);
        } else {
          filters.private.push(attribute);
        }
      } else if (typeof policy === 'string') {
        // Check that role exists
        if (!_roleUtil2.default.roleExists(policy, config.roles)) throw new Error('role ' + policy + ' does not exists');

        // If reqRole is allowed, set attribute as allowed
        if (_roleUtil2.default.isRoleAllowed(reqRole, policy, config.roles)) filters.allowed.push(attribute);
      }
    } else {
      filters.allowed.push(attribute);
    }
  }

  return filters;
};

var _roleUtil = require('../util/roleUtil');

var _roleUtil2 = _interopRequireDefault(_roleUtil);

var _messageUtil = require('../util/messageUtil');

var _messageUtil2 = _interopRequireDefault(_messageUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }