


export default async function(req){


  const model = req.options.model
  const modelId = req.params.id

  if(!req.user || !req.user.id) return false

  const userId = req.user.id
  const modelInDb = await sails.models[model].findOne(modelId)

  if(!modelInDb) throw new Error('model not found - id given in parameter is not valid')

  if(req.user.role === 'admin') return true

  if('owner' in modelInDb){

    if(owner instanceof Array){

      for(let owner of modelInDb.owners){
        if(typeof owner === 'string'){
          if(owner === userId) return true

        }else{
          if(owner.id === userId) return true
        }
      }

    }else{
      if(typeof owner === 'string'){
        return owner === userId

      }else{
        return owner.id === userId
      }
    }

  }else{
    return false
  }
}
