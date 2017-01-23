

import roleUtil from '../util/roleUtil'
import messageUtil from '../util/messageUtil'
import policyMethods from './policyMethods'


export default class parametersPolicy extends policyMethods {

  constructor(req, config){

    super()

    const controller = req.options.controller
    const action = req.options.action


    this.config    = config
    this.reqRole   = req.user ? (req.user.role || 'user') : 'guest'
    this.askedRole = config[controller][action] || config.all

    this.container = config[controller]
    this.policy = config[controller][action]
    this.policyName = action

    this.errorMessages = messageUtil.generateActionErrorMessages(controller, action, this.reqRole, this.askedRole)
  }
}

/*
export default function (req, config) {

  const controller = req.options.controller
  const action = req.options.action

  const reqRole   = req.user ? (req.user.role || 'user') : 'guest'
  const askedRole = config[controller][action] || config.all

  const errorMessages = messageUtil.generateActionErrorMessages(controller, action, reqRole, askedRole)

  // ------------------
  // ----- OBJECT -----
  // ------------------

  // config[controller][action] is an object (means that we must use lower level policy)
  if(typeof config[controller][action] === 'object') return false //Pending



  // ------------------
  // ---- BOOLEAN -----
  // ------------------

  // Bypass if policy is "true" or if wildcard is true and no controller[action] policy exists
  if(config[controller][action] === true || (config.all === true && !(action in config[controller]))) return true //Allow

  // If wildcard is deny and there is no config for the asked controller[action]
  if(config.all === false && !(action in config[controller])){
    throw new Error(errorMessages.notFound) //Deny
  }

  // If controller[action] policy is set to false
  if(config[controller][action] === false){
    throw new Error(errorMessages.setToFalse) //Deny
  }



  // ------------------
  // ----- STRING -----
  // ------------------

  // Wildcard is a role
  // Check if role exists and if controller[action] has no policy we use wildcard
  if(typeof config.all === 'string' && roleUtil.roleExists(config.all, config.roles) && !config[controller][action]){
    if(roleUtil.isRoleAllowed(reqRole, config.all, config.roles)){
      return true

    }else{
      throw new Error(errorMessages.roleIsTooLow)
    }
  }

  // If config.role is guest we only allow guest to access
  if(askedRole === 'guest'){
    if(reqRole === 'guest'){
      return true //Allow

    }else{
      throw new Error(errorMessages.setToGuest) //Deny
    }
  }


  // Deny guests
  if(reqRole === 'guest' && askedRole !== 'guest'){
    throw new Error(errorMessages.forbiddenForGuests) //Deny
  }


  // user has not role sufficient to access ressource
  if(roleUtil.isRoleAllowed(reqRole, askedRole, config.roles)){
    return true

  }else{
    throw new Error(errorMessages.roleIsTooLow) // Deny

  }


  return false //Pending - call next policy
}
*/
