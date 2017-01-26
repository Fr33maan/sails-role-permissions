

export default class {

  constructor(reqRole, config){
    this.reqRole = reqRole
    this.config = config
    this.rolesConfig = config.roles
  }

  isRoleAllowed(limitRole){

    if(this.reqRole !== 'guest'){
      if(!this.roleExists(this.reqRole, this.rolesConfig)) throw new Error('reqRole "' + this.reqRole + '" does not exists')
    }

    if(!this.roleExists(limitRole, this.rolesConfig)) throw new Error('limitRole "' + limitRole + '" does not exists')

    // Highest permitted roles are in the lowest index
    return this.rolesConfig.indexOf(this.reqRole) > -1 && this.rolesConfig.indexOf(this.reqRole) <= this.rolesConfig.indexOf(limitRole)
  }

  roleExists(role){

    if(!role) role = this.reqRole

    if(!this.config.roles) throw new Error('rolesConfig must be provided to roleUtil.roleExists()')
    return this.config.roles.indexOf(role) > -1
  }

  getHighestRole(){
    return this.rolesConfig[0]
  }


}
