'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
  function _class(reqRole, config) {
    _classCallCheck(this, _class);

    this.reqRole = reqRole;
    this.config = config;
    this.rolesConfig = config.roles;
  }

  _createClass(_class, [{
    key: 'isRoleAllowed',
    value: function isRoleAllowed(limitRole) {

      if (this.reqRole !== 'guest') {
        if (!this.roleExists(this.reqRole, this.rolesConfig)) throw new Error('reqRole "' + this.reqRole + '" does not exists');
      }

      if (!this.roleExists(limitRole, this.rolesConfig)) throw new Error('limitRole "' + limitRole + '" does not exists');

      // Highest permitted roles are in the lowest index
      return this.rolesConfig.indexOf(this.reqRole) > -1 && this.rolesConfig.indexOf(this.reqRole) <= this.rolesConfig.indexOf(limitRole);
    }
  }, {
    key: 'roleExists',
    value: function roleExists(role) {

      if (!role) role = this.reqRole;

      if (!this.config.roles) throw new Error('rolesConfig must be provided to roleUtil.roleExists()');
      return this.config.roles.indexOf(role) > -1;
    }
  }, {
    key: 'getHighestRole',
    value: function getHighestRole() {
      return this.rolesConfig[0];
    }
  }]);

  return _class;
}();

exports.default = _class;