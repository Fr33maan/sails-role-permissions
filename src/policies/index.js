import R from 'ramda'

import controllersPolicy  from './controllersPolicy'
import actionsPolicy      from './actionsPolicy'
import parametersPolicy      from './parametersPolicy'
import reqParamsPolicy from './reqParamsPolicy'

import {removeAutoAttributes, attributesFilter, filterArrayOrObject} from '../util/attributeUtil'


export default function(req, res, next, injectedConfig){

  function filterReqBody(filter){
    req.body = R.omit(filter, req.body)
  }

  function filterResult(filter){
    // req.body = R.props(filter, req.body)
  }

  let config = sails ? sails.config.permissions : injectedConfig

  try{
    // Check if action explicitely exists in controller
    // If not -> it is a blueprint
    const controller = req.options.controller
    const action = req.options.action
    const isBlueprint = !(action in sails.controllers[controller])

    // Remove id, createdAt and updatedAt from each object of req.body if we are using create or update blueprints
    if(isBlueprint && (action === 'create' || action === 'update') && config.removeAutoAttributes){
      req.body = removeAutoAttributes(req.body)
    }

    // Filter req with controller and action policies (Allow / Deny / Pending)
    if(new controllersPolicy(req, config).check())  return next() //Bypass other policies if policy returns true
    if(new actionsPolicy(req, config).check())      return next()


    // Destroy blueprint should already have been allowed / denied
    // Attributes permissioning is only available for blueprints
    if(!isBlueprint){
      const msg = "Request is not a blueprint and should already have been filtered, this might be a bug or a bad configuration. Don't set action policies as object if they aren't blueprints"
      // console.log(msg)
      throw new Error(msg)
    }

    // Will allow / deny "add" "remove" "populate" blueprint
    if(new parametersPolicy(req, config).check())   return next()

    // We are using "find" "findOne" "create" "update"
    const filters = attributesFilter(req, config)

    if(action === 'create'){
      // Filter body
      req.body = filterArrayOrObject(req.body, filters)
      return next()

    }else if(action === 'update'){
      // OwnershipPolicy
      // Filter req.body
      return next()

    }else if(action === 'find' || action === 'findone'){
      // Check that req.where && req.sort is not on private attributes
      if(action === 'find') reqParamsPolicy(req, filters)

      // Execute action
      // Filter result
    }


    const msg = 'request has not been explicitely allowed and this might be a security issue -> Access Denied'
    // console.log(msg)
    throw new Error(msg)
    next()
  }catch(e){
    console.log(e.message)
    res.forbidden(e)
  }
}
