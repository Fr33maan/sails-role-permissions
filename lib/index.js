'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _policies = require('./policies');

var _policies2 = _interopRequireDefault(_policies);

var _defaultRoles = require('./config/defaultRoles');

var _defaultRoles2 = _interopRequireDefault(_defaultRoles);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      var permissions = sails.config.permissions;

      // Flavour sails policies with additional permissionsPolicies
      sails.config.policies = _lodash2.default.each(policies, this.addHookPolicies);

      // If no wildcard is set in config.permissions
      var wildcard = permissions['*'];
      var wildcardAlias = permissions.all;

      // Used in case of policy wildcard is a function instead of a boolean
      // Default is false
      if (wildcard === undefined && wildcardAlias === undefined) {
        permissions['*'] = false;
        permissions.all = false;
      } else if (wildcard === undefined && wildcardAlias !== undefined) {
        permissions['*'] = permissions.all;
      } else if (wildcard !== undefined && wildcardAlias === undefined) {
        permissions.all = permissions['*'];
      }

      // Lowercase any key in permission config as req.options are lowercased
      _lodash2.default.each(permissions, function (value, key) {
        if (typeof key === 'string' && key !== 'roles') {
          permissions[key.toLowerCase()] = value;
        }

        if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object') {
          _lodash2.default.each(value, function (subValue, subKey) {
            if (typeof subKey === 'string') permissions[key.toLowerCase()][subKey.toLowerCase()] = subValue;
          });
        }
      });

      // Check that no populate policy is set to true
      this.checkPoliciesValidity(permissions);

      sails.log.verbose('sails-role-permissions hook initialized');
      next();
    },

    checkPoliciesValidity: function checkPoliciesValidity(config) {
      _lodash2.default.each(config, function (cPolicies, controller) {

        // We don't take any action if controller is not a sails model
        if (!(controller in sails.models)) return;

        if ((typeof cPolicies === 'undefined' ? 'undefined' : (0, _typeof3.default)(cPolicies)) === 'object') {
          _lodash2.default.each(cPolicies, function (cAction, action) {

            switch (action) {
              case 'populate':
                if (cAction === true) sails.log.warn('sails-role-permissions hook - Populate policy is set to true, NO FILTER WILL BE APPLIED ON IT => ' + controller + ' - ' + action);
            }
          });
        }
      });
    },

    // Function to manipulate sails policies and add permissionsPolicies
    addHookPolicies: function addHookPolicies(value, key, collection) {

      // Store at permissions config level the value of default policy if value is true or false
      if (key === '*' && typeof value === 'boolean') {
        sails.config.permissions['*'] = value;
        sails.config.permissions.all = value; // Alias
        collection[key] = [_policies2.default];
      }

      if (typeof value === 'string') {
        collection[key] = [value, _policies2.default];
      } else if (value instanceof Array) {
        // Rebuild the policy with previous policies plus additional policies
        collection[key] = [].concat((0, _toConsumableArray3.default)(value), [_policies2.default]);
      } else if (value instanceof Object) {
        collection[key] = _lodash2.default.each(value, this.addHookPolicies);
      }
    }
  };
};