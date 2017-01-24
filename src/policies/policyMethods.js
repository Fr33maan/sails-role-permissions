
import roleUtil from '../util/roleUtil'


export default class {

  check(){
    if(this.customPreCheck && this.customPreCheck()) return false // Pending
    if(this.policyIsObject()) return false // Pending
    if(this.wildcardIsTrue()) return true  // Allow

    this.wildcardFalseAndNoBypass() // Throw Deny
    this.policyIsFalse()            // Throw Deny

    if(this.wildcardAsRole()) return true  // Allow - Throw deny
    if(this.policyIsGuest())  return true  // Allow - Throw deny

    this.reqIsGuest()   // Throw Deny
    if(this.policyIsRole())  return true  // Allow - Throw deny

    return false // Policy not covered - Pending
  }


  // ------------------
  // ----- OBJECT -----
  // ------------------
  policyIsObject(){
    // config[controller][action] is an object (means that we must use lower level policy)
    return typeof this.policy === 'object' //Pending
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
    if(typeof this.config.all === 'string' && roleUtil.roleExists(this.config.all, this.config.roles) && !this.policy){
      if(roleUtil.isRoleAllowed(this.reqRole, this.config.all, this.config.roles)){
        return true

      }else{
        throw new Error(this.errorMessages.roleIsTooLow)
      }
    }
  }


  policyIsGuest(){
    // If config.role is guest we only allow guest to access
    if(this.askedRole === 'guest'){
      if(this.reqRole === 'guest'){
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

  policyIsRole(){
    // user has not role sufficient to access ressource
    if(roleUtil.isRoleAllowed(this.reqRole, this.askedRole, this.config.roles)){
      return true

    }else{
      throw new Error(this.errorMessages.roleIsTooLow) // Deny

    }
  }


}
