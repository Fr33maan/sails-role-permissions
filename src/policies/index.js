import R from 'ramda'

import controllersPolicy  from './controllersPolicy'
import actionsPolicy      from './actionsPolicy'
import parametersPolicy   from './parametersPolicy'
import reqParamsPolicy    from './reqParamsPolicy'

import {removeAutoAttributes, attributesFilter, filterArrayOrObject} from '../util/attributeUtil'
import resUtil   from '../util/resUtil'
import ownerUtil from '../util/ownerUtil'


export default async function(req, res, next, injectedConfig){

  let config = sails ? sails.config.permissions : injectedConfig

  try{
    // Check if action explicitely exists in controller
    // If not -> it is a blueprint
    const controller = req.options.controller
    const action = req.options.action
    const isBlueprint = !(action in sails.controllers[controller])

    // Remove id, createdAt and updatedAt from each object of req.body if we are using create or update blueprints
    if(isBlueprint && (action === 'create' || action === 'update') && config.removeAutoAttributes === true){
      req.body = removeAutoAttributes(req.body)
    }

    // Filter req with controller and action policies (Allow / Deny / Pending)
    if(new controllersPolicy(req, config).check())  return next() //Bypass other policies if policy returns true
    if(new actionsPolicy(req, config).check())      return next()


    // Destroy blueprint should already have been allowed / denied
    // Attributes permissioning is only available for blueprints
    if(!isBlueprint){
      const msg = "Request is not a blueprint and should already have been filtered, this might be a bug or a bad configuration. Don't set action's policies as object if they aren't blueprints"
      // console.log(msg)
      throw new Error(msg)
    }

    // Will allow / deny "add" "remove" "populate" blueprint
    if(new parametersPolicy(req, config).check())   return next()

    // We are using "find" "findOne" "create" "update"
    const filters = attributesFilter(req, config)

    // Check ownership and say it req is owner of asked object for 'update' && 'findOne'
    const isOwner = await ownerUtil(req) // will return true if user is owner or is admin

    if(action === 'create'){
      // Filter body
      req.body = filterArrayOrObject(req.body, filters)
      return next()

    }else if(action === 'update'){

      if(!isOwner) throw new Error('req is not owner and tried to update an object')

      // Filter req.body
      req.body = filterArrayOrObject(req.body, filters, isOwner)
      return next()

    }else if(action === 'find' || action === 'findOne'){
      // Check that req.where && req.sort is not on private attributes
      if(action === 'find') reqParamsPolicy(req, filters)

      // Call blueprint if find or findOne
      const blueprint = sails.hooks.blueprints.middleware[action.toLowerCase()]
      new Promise((resolve, reject) => {
        return blueprint(req, resUtil(res, resolve, reject))
      })
      .then(models => {
        // Filter result
        return res.ok(filterArrayOrObject(models, filters, isOwner))
      })
      .catch(data => {
        // Send error response
        return res[data.method](data.data)
      })

    // This case should not happen
    }else{
      const msg = 'request has not been explicitely allowed and this might be a security issue -> Access Denied'
      throw new Error(msg)
    }

  }catch(e){
    console.log(e.message)
    res.forbidden(e)
  }
}
