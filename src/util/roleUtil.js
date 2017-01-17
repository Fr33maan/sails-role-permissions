

export default {

  isRoleAllowed : function(reqRole, limitRole, rolesConfig){

    if(!this.roleExists(reqRole, rolesConfig)) throw new Error('Role "' + reqRole + '" does not exists')
    if(!this.roleExists(limitRole, rolesConfig)) throw new Error('Role "' + limitRole + '" does not exists')

    // Highest permitted roles are in the lowest index 
    return rolesConfig.indexOf(reqRole) <= rolesConfig.indexOf(limitRole)
  },

  roleExists : function(role, rolesConfig){
    return rolesConfig.indexOf(role) > -1
  }



}
