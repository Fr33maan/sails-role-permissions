
// if(typeof regeneratorRuntime === 'undefined') require('babel-polyfill')

export default async function(req, rolesConfig){

  const model = req.options.model
  let modelId

  if(!req.user || !req.user.id) return false

  const userId = req.user.id

  switch(req.options.action){
    case 'add':
    case 'remove':
    case 'populate':
      modelId = req.params.parentid
      break

    default:
      modelId = req.params.id

  }

  if(model === 'user'){
    return modelId === userId
  }

  if(!modelId) return false
  const modelInDb = await sails.models[model].findOne(modelId).populate('owner')

  if(!modelInDb) throw new Error('model not found - id given in parameter is not valid')


  // Highest role bypass everything
  if(req.user.role === rolesConfig[0]) return true

  if('owner' in modelInDb){

    const container = modelInDb.owner

    if(!(container instanceof Array)) { container = [container]; }

    for(let owner of container){

      // owner is an id
      if(typeof owner === 'string'){
        if(owner === userId) return true

      // owner is an object and we expect an id parameter inside
      }else if('id' in owner){
        if(owner.id === userId) return true
      }
    }

  }

  return false
}
