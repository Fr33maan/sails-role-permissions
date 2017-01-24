

import roleUtil from '../util/roleUtil'
import messageUtil from '../util/messageUtil'
import R from 'ramda'


export function attributesFilter(req, config, modelDefinition) {

  const modelName = req.options.controller

  // Assume that we are in sails environment because we manually inject modelDefinition for testing
  if(!modelDefinition){
    if(!(modelName in sails.models)) throw new Error(`Model (${modelName}) not found in sails`)

    modelDefinition = sails.models[modelName].definition
  }

  const controller  = req.options.controller
  const action      = req.options.action
  const container   = config[controller][action]

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

    if(attribute in container){

      const policy = container[attribute]
      let visibility

      if(policy === 'private'){
        if(reqRole === 'admin'){
          filters.allowed.push(attribute)
        }else{
          filters.private.push(attribute)
        }

      }else if(typeof policy === 'string'){
        // Check that role exists
        if(!roleUtil.roleExists(policy, config.roles)) throw new Error(`role ${policy} does not exists`)

        // If reqRole is allowed, set attribute as allowed
        if(roleUtil.isRoleAllowed(reqRole, policy, config.roles)) filters.allowed.push(attribute)
      }

    }else{
      filters.allowed.push(attribute)
    }
  }

  return filters
}


export function removeAutoAttributes(arrayOrObject){

  if(arrayOrObject instanceof Array){
    return arrayOrObject.map(R.omit(['id', 'createdAt', 'updatedAt']))

  }else{
    return R.omit(['id', 'createdAt', 'updatedAt'], arrayOrObject)
  }
}

export function filterArrayOrObject(arrayOrObject, filters){

  function buildNewBody (body){
    const newBody = {}
    for(let key in body){
      if(filters.allowed.indexOf(key) > -1) newBody[key] = body[key]
    }
    return newBody
  }

  if(arrayOrObject instanceof Array){
    return arrayOrObject.map(buildNewBody)

  }else{
    return buildNewBody(arrayOrObject)
  }
}
