import controllersPolicy  from './controllersPolicy'
import actionsPolicy      from './actionsPolicy'


export default function(req, res, next, injectedConfig){

  let config = sails ? sails.config.permissions : injectedConfig

  function wrapper(fn){
      return fn(req, res, config)
  }

  try{
    if(controllersPolicy(req, config))  return next() //Bypass other policies if policy returns true
    if(actionsPolicy(req, config))      return next() 

    next()
  }catch(e){
    res.forbidden(e)
  }
}
