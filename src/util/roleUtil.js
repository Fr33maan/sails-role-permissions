

export default {

  isRoleAllowed : function(reqRole, limitRole, rolesConfig){

    if(reqRole !== 'guest'){
      if(!this.roleExists(reqRole, rolesConfig)) throw new Error('reqRole "' + reqRole + '" does not exists')
    }

    if(!this.roleExists(limitRole, rolesConfig)) throw new Error('limitRole "' + limitRole + '" does not exists')

    // Highest permitted roles are in the lowest index
    return rolesConfig.indexOf(reqRole) > -1 && rolesConfig.indexOf(reqRole) <= rolesConfig.indexOf(limitRole)
  },

  roleExists : function(role, rolesConfig){
    if(!rolesConfig) throw new Error('rolesConfig must be provided to roleUtil.roleExists()')
    return rolesConfig.indexOf(role) > -1
  }



}
