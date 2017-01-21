
import roleUtil from '../util/roleUtil'
import messageUtil from '../util/messageUtil'

export default function (req, config) {

  const controller = req.options.controller

  const reqRole   = req.user ? (req.user.role || 'user') : 'guest'
  const askedRole = config[controller] || config.all

  const errorMessages = messageUtil.generateControllerErrorMessages(controller, reqRole, askedRole)

  // ------------------
  // ----- OBJECT -----
  // ------------------

  // config[controller] is an object (means that we must use lower level policy)
  if(typeof config[controller] === 'object') return false //Pending



  // ------------------
  // ---- BOOLEAN -----
  // ------------------

  // Bypass if policy is "true" or if all is true and no controller policy exists
  if(config[controller] === true || (config.all === true && !(controller in config))) return true //Allow

  // If config.all is deny and there is no config for the asked controller
  if(config.all === false && !(controller in config)){
    throw new Error(errorMessages.notFound) //Deny
  }

  // If controller policy is set to false
  if(config[controller] === false){
    throw new Error(errorMessages.setToFalse) //Deny
  }


  // ------------------
  // ----- STRING -----
  // ------------------

  // Wildcard is a role
  // Check if role exists and if controller has no policy we use wildcard
  if(typeof config.all === 'string' && roleUtil.roleExists(config.all, config.roles) && !config[controller]){
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
    throw new Error(errorMessages.rankIsTooLow) // Deny

  }


  return false //Pending - call next policy
}
