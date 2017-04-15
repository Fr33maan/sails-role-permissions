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

var _RoleUtil = require('../util/RoleUtil');

var _RoleUtil2 = _interopRequireDefault(_RoleUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
  function _class() {
    (0, _classCallCheck3.default)(this, _class);
  }

  (0, _createClass3.default)(_class, [{
    key: 'check',
    value: function check() {
      if (this.customPreCheck && this.customPreCheck()) return false; // Pending
      this.configRoleUtil();
      if (this.policyIsObject()) return false; // Pending
      if (this.wildcardIsTrue()) return true; // Allow

      this.wildcardFalseAndNoBypass(); // Throw Deny
      this.policyIsFalse(); // Throw Deny

      if (this.wildcardAsRole()) return true; // Allow - Throw deny
      if (this.policyIsGuest()) return true; // Allow - Throw deny

      this.reqIsGuest(); // Throw Deny
      if (this.policyIsPrivate()) return false; // Pending
      if (this.policyIsRole()) return true; // Allow - Throw deny

      return false; // Policy not covered - Pending
    }
  }, {
    key: 'configRoleUtil',
    value: function configRoleUtil() {

      this.RoleUtil = new _RoleUtil2.default(this.reqRole, this.config);
    }

    // ------------------
    // ----- OBJECT -----
    // ------------------

  }, {
    key: 'policyIsObject',
    value: function policyIsObject() {
      // config[controller][action] is an object (means that we must use lower level policy)
      if ((0, _typeof3.default)(this.policy) === 'object') {

        // If there is a wildcard in the policy, we use it instead of set status to Pending
        if ('*' in this.policy && typeof this.policy['*'] === 'string') {
          this.policy = this.policy['*'];
          this.askedRole = this.policy;
          return false;
        }

        // Set to pending
        return true;
      }
    }

    // ------------------
    // ---- BOOLEAN -----
    // ------------------

    // Bypass if policy is "true" or if wildcard is true and no policy exists

  }, {
    key: 'wildcardIsTrue',
    value: function wildcardIsTrue() {
      return this.policy === true || this.config.all === true && !(this.policyName in this.container);
    }
  }, {
    key: 'wildcardFalseAndNoBypass',
    value: function wildcardFalseAndNoBypass() {
      // If wildcard is deny and there is no config for the asked controller[action]
      if (this.config.all === false && !(this.policyName in this.container)) {
        throw new Error(this.errorMessages.notFound); //Deny
      }
    }
  }, {
    key: 'policyIsFalse',
    value: function policyIsFalse() {
      // If controller[action] policy is set to false
      if (this.policy === false) {
        throw new Error(this.errorMessages.setToFalse); //Deny
      }
    }

    // ------------------
    // ----- STRING -----
    // ------------------

  }, {
    key: 'wildcardAsRole',
    value: function wildcardAsRole() {
      // Wildcard is a role
      // Check if role exists and if no policy we use wildcard
      if (typeof this.config.all === 'string' && this.RoleUtil.roleExists(this.config.all) && !this.policy) {
        if (this.RoleUtil.isRoleAllowed(this.config.all)) {
          return true;
        } else {
          throw new Error(this.errorMessages.roleIsTooLow);
        }
      }
    }
  }, {
    key: 'policyIsGuest',
    value: function policyIsGuest() {
      // If config.role is guest we only allow guest to access
      if (this.askedRole === 'guest') {
        if (this.reqRole === 'guest' || this.reqRole === this.RoleUtil.getHighestRole()) {
          return true; //Allow
        } else {
          throw new Error(this.errorMessages.setToGuest); //Deny
        }
      }
    }
  }, {
    key: 'reqIsGuest',
    value: function reqIsGuest() {
      // Deny guests
      if (this.reqRole === 'guest' && this.askedRole !== 'guest') {
        throw new Error(this.errorMessages.forbiddenForGuests); //Deny
      }
    }
  }, {
    key: 'policyIsPrivate',
    value: function policyIsPrivate() {
      return this.policy === 'private';
    }
  }, {
    key: 'policyIsRole',
    value: function policyIsRole() {
      // user has not role sufficient to access ressource
      if (this.RoleUtil.isRoleAllowed(this.askedRole)) {
        return true;
      } else {
        throw new Error(this.errorMessages.roleIsTooLow); // Deny
      }
    }
  }]);
  return _class;
}();

exports.default = _class;