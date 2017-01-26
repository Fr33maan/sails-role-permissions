'use strict';

var _policies = require('./policies');

var _policies2 = _interopRequireDefault(_policies);

var _defaultRoles = require('./config/defaultRoles');

var _defaultRoles2 = _interopRequireDefault(_defaultRoles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

module.exports = function (sails) {
  return {

    configure: function configure() {
      if (!sails.config.permissions) sails.config.permissions = {};
      if (!sails.config.permissions.roles) sails.config.permissions.roles = _defaultRoles2.default;
      if (!sails.config.permissions.removeAutoAttributes) sails.config.permissions.removeAutoAttributes = true;

      // Remove "guest" role from roles if it has been added by user
      sails.config.permissions.roles = sails.config.permissions.roles.filter(function (role) {
        return role !== 'guest';
      });
    },

    // Initialize the hook
    initialize: function initialize(next) {
      var policies = sails.config.policies;

      // Flavour sails policies with additional permissionsPolicies
      sails.config.policies = _.each(policies, this.addHookPolicies);

      // If no wildcard is set in config.permissions
      var wildcard = sails.config.permissions['*'];
      var wildcardAlias = sails.config.permissions.all;

      // Used in case of policy wildcard is a function instead of a boolean
      // Default is false
      if (wildcard === undefined && wildcardAlias === undefined) {
        sails.config.permissions['*'] = false;
        sails.config.permissions.all = false;
      } else if (wildcard === undefined && wildcardAlias !== undefined) {
        sails.config.permissions['*'] = sails.config.permissions.all;
      } else if (wildcard !== undefined && wildcardAlias === undefined) {
        sails.config.permissions.all = sails.config.permissions['*'];
      }

      console.log('role-permissions hook initialized');
      next();
    },

    // Function to manipulate sails policies and add permissionsPolicies
    addHookPolicies: function addHookPolicies(value, key, collection) {

      // Store at permissions config level the value of default policy if value is true or false
      if (key === '*' && typeof value === 'boolean') {
        sails.config.permissions['*'] = value;
        sails.config.permissions.all = value; // Alias
      }

      // Rebuild the policy with previous policies plus additional policies
      collection[key] = [].concat(_toConsumableArray(value), [_policies2.default]);
    }
  };
};