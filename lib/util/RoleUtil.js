'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function () {
  function _class(reqRole, config) {
    (0, _classCallCheck3.default)(this, _class);

    this.reqRole = reqRole;
    this.config = config;
    this.rolesConfig = config.roles;
  }

  (0, _createClass3.default)(_class, [{
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