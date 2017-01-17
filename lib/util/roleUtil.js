'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  isRoleAboveLimit: function isRoleAboveLimit(role, limitRole, rolesConfig) {

    if (!this.roleExists(role, rolesConfig)) throw new Error('Role "' + role + '" does not exists');
    if (!this.roleExists(limitRole, rolesConfig)) throw new Error('Role "' + limitRole + '" does not exists');

    // return rolesConfig.indexOf()

    console.log(this);
  },

  roleExists: function roleExists(role, rolesConfig) {

    console.log(rolesConfig);
    console.log(role);
    return rolesConfig.indexOf(role) > -1;
  }

};