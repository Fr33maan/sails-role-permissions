

import RoleUtil from '../util/RoleUtil'
import messageUtil from '../util/messageUtil'
import _ from 'lodash'


export function attributesFilter(req, config, modelDefinition, forceModel, forceAction) {

  const modelName = forceModel || req.options.controller

  // Assume that we are in sails environment because we manually inject modelDefinition for testing
  if(!modelDefinition){
    if(!(modelName in sails.models)) throw new Error(`Model (${modelName}) not found in sails`)

    modelDefinition = sails.models[modelName].definition

    for(let association of sails.models[modelName].associations){
      modelDefinition[association.alias] = 'association'
    }
  }

  const controller  = forceModel || req.options.controller
  const action      = forceAction || req.options.action
  let container     = config[controller][action]

  // Take find config if findOne config does not exists
  if(action === 'findOne' && !container) container = config[controller].find

  const reqRole = req.user ? (req.user.role || 'user') : 'guest'

  const filters = {
    allowed  : [
      // Visible attributes for this user
    ],
    private : [
      // Conditional attributes for this user
    ]
  }

  for(let attribute in modelDefinition){

    if(typeof container === 'object' && attribute in container){

      const policy = container[attribute]
      let visibility

      if(policy === 'private'){
        if(reqRole === 'admin'){
          filters.allowed.push(attribute)
        }else{
          filters.private.push(attribute)
        }

      }else if(typeof policy === 'string'){

        const RoleUtilInstance = new RoleUtil(reqRole, config)

        // Check that role exists
        if(!RoleUtilInstance.roleExists(policy)) throw new Error(`role ${policy} does not exists`)

        // If reqRole is allowed, set attribute as allowed
        if(RoleUtilInstance.isRoleAllowed(policy)) filters.allowed.push(attribute)

      }else if(typeof policy === 'boolean'){
        if(policy) filters.allowed.push(attribute)
      }

    }else{
      filters.allowed.push(attribute)
    }
  }

  return filters
}


export function removeAutoAttributes(arrayOrObject){

  if(arrayOrObject instanceof Array){
    return arrayOrObject.map(object => _.omit(object, ['id', 'createdAt', 'updatedAt']))

  }else{
    return _.omit(arrayOrObject, ['id', 'createdAt', 'updatedAt'])
  }
}

export function filterArrayOrObject(arrayOrObject, filters, isOwner){

  function buildNewBody (body){
    const newBody = {}
    for(let key in body){
      if(filters.allowed.indexOf(key) > -1) newBody[key] = body[key]
      if(isOwner && filters.private.indexOf(key) > -1) newBody[key] = body[key]
    }
    return newBody
  }

  if(arrayOrObject instanceof Array){
    return arrayOrObject.map(buildNewBody)

  }else{
    return buildNewBody(arrayOrObject)
  }
}
