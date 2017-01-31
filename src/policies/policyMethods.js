
import RoleUtil from '../util/RoleUtil'


export default class {

  check(){
    if(this.customPreCheck && this.customPreCheck()) return false // Pending
    this.configRoleUtil()
    if(this.policyIsObject()) return false // Pending
    if(this.wildcardIsTrue()) return true  // Allow

    this.wildcardFalseAndNoBypass() // Throw Deny
    this.policyIsFalse()            // Throw Deny

    if(this.wildcardAsRole()) return true  // Allow - Throw deny
    if(this.policyIsGuest())  return true  // Allow - Throw deny

    this.reqIsGuest()   // Throw Deny
    if(this.policyIsPrivate()) return false // Pending
    if(this.policyIsRole())  return true  // Allow - Throw deny

    return false // Policy not covered - Pending
  }

  configRoleUtil(){

    this.RoleUtil = new RoleUtil(this.reqRole, this.config)

  }


  // ------------------
  // ----- OBJECT -----
  // ------------------
  policyIsObject(){
    // config[controller][action] is an object (means that we must use lower level policy)
    if(typeof this.policy === 'object'){

      // If there is a wildcard in the policy, we use it instead of set status to Pending
      if('*' in this.policy && typeof this.policy['*'] === 'string'){
        this.policy    = this.policy['*']
        this.askedRole = this.policy
        return false
      }

      // Set to pending
      return true
    }
  }



  // ------------------
  // ---- BOOLEAN -----
  // ------------------

  // Bypass if policy is "true" or if wildcard is true and no policy exists
  wildcardIsTrue(){
    return (this.policy === true || (this.config.all === true && !(this.policyName in this.container)))
  }

  wildcardFalseAndNoBypass(){
    // If wildcard is deny and there is no config for the asked controller[action]
    if(this.config.all === false && !(this.policyName in this.container)){
      throw new Error(this.errorMessages.notFound) //Deny
    }
  }

  policyIsFalse(){
    // If controller[action] policy is set to false
    if(this.policy === false){
      throw new Error(this.errorMessages.setToFalse) //Deny
    }
  }

  // ------------------
  // ----- STRING -----
  // ------------------

  wildcardAsRole(){
    // Wildcard is a role
    // Check if role exists and if no policy we use wildcard
    if(typeof this.config.all === 'string' && this.RoleUtil.roleExists(this.config.all) && !this.policy){
      if(this.RoleUtil.isRoleAllowed(this.config.all)){
        return true

      }else{
        throw new Error(this.errorMessages.roleIsTooLow)
      }
    }
  }


  policyIsGuest(){
    // If config.role is guest we only allow guest to access
    if(this.askedRole === 'guest'){
      if(this.reqRole === 'guest' || this.reqRole === this.RoleUtil.getHighestRole()){
        return true //Allow

      }else{
        throw new Error(this.errorMessages.setToGuest) //Deny
      }
    }
  }

  reqIsGuest(){
    // Deny guests
    if(this.reqRole === 'guest' && this.askedRole !== 'guest'){
      throw new Error(this.errorMessages.forbiddenForGuests) //Deny
    }
  }

  policyIsPrivate(){
    return this.policy === 'private'
  }

  policyIsRole(){
    // user has not role sufficient to access ressource
    if(this.RoleUtil.isRoleAllowed(this.askedRole)){
      return true

    }else{
      throw new Error(this.errorMessages.roleIsTooLow) // Deny

    }
  }


}
