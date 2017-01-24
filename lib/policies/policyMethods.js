'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _roleUtil = require('../util/roleUtil');

var _roleUtil2 = _interopRequireDefault(_roleUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class() {
    _classCallCheck(this, _class);
  }

  _createClass(_class, [{
    key: 'check',
    value: function check() {
      if (this.customPreCheck && this.customPreCheck()) return false; // Pending
      if (this.policyIsObject()) return false; // Pending
      if (this.wildcardIsTrue()) return true; // Allow

      this.wildcardFalseAndNoBypass(); // Throw Deny
      this.policyIsFalse(); // Throw Deny

      if (this.wildcardAsRole()) return true; // Allow - Throw deny
      if (this.policyIsGuest()) return true; // Allow - Throw deny

      this.reqIsGuest(); // Throw Deny
      if (this.policyIsRole()) return true; // Allow - Throw deny

      return false; // Policy not covered - Pending
    }

    // ------------------
    // ----- OBJECT -----
    // ------------------

  }, {
    key: 'policyIsObject',
    value: function policyIsObject() {
      // config[controller][action] is an object (means that we must use lower level policy)
      return _typeof(this.policy) === 'object'; //Pending
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
      if (typeof this.config.all === 'string' && _roleUtil2.default.roleExists(this.config.all, this.config.roles) && !this.policy) {
        if (_roleUtil2.default.isRoleAllowed(this.reqRole, this.config.all, this.config.roles)) {
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
        if (this.reqRole === 'guest') {
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
    key: 'policyIsRole',
    value: function policyIsRole() {
      // user has not role sufficient to access ressource
      if (_roleUtil2.default.isRoleAllowed(this.reqRole, this.askedRole, this.config.roles)) {
        return true;
      } else {
        throw new Error(this.errorMessages.roleIsTooLow); // Deny
      }
    }
  }]);

  return _class;
}();

exports.default = _class;