
import {
  controllerNotFound,
  controllerSetToFalse,
  controllerSetToGuest,
  controllerForbiddenForGuests,
  controllerRankIsTooLow

} from '../config/errorMessages'

import roleUtil from '../util/roleUtil'

export default function (req, config) {

  const controller = req.options.controller


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
    throw new Error(controllerNotFound) //Deny
  }

  // If controller policy is set to false
  if(config[controller] === false){
    throw new Error(controllerSetToFalse) //Deny
  }


  // ------------------
  // ----- STRING -----
  // ------------------

  const askedRole = config[controller]
  const reqRole   = req.user ? (req.user.role || 'user') : 'guest'


  // If config.role is guest we only allow guest to access
  if(askedRole === 'guest'){
    if(reqRole === 'guest'){
      return true //Allow

    }else{
      throw new Error(controllerSetToGuest + reqRole) //Deny
    }
  }


  // Deny guests
  if(reqRole === 'guest' && askedRole !== 'guest'){
    throw new Error(controllerForbiddenForGuests) //Deny
  }


  // user has not role sufficient to access ressource
  if(roleUtil.isRoleAllowed(reqRole, askedRole, config.roles)){
    return true

  }else{
    throw new Error(controllerRankIsTooLow) // Deny

  }


  return false //Pending - call next policy
}
