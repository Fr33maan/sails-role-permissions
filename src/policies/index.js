import controllersPolicy  from './controllersPolicy'
import actionsPolicy      from './actionsPolicy'
import parametersPolicy      from './parametersPolicy'


export default function(req, res, next, injectedConfig){

  let config = sails ? sails.config.permissions : injectedConfig

  try{
    if(new controllersPolicy(req, config).check())  return next() //Bypass other policies if policy returns true
    if(new actionsPolicy(req, config).check())      return next()
    if(new parametersPolicy(req, config).check())   return next()

    // check attributes -> set filters

    // check find / create
    // apply filters before / after

    // caching

    throw new Error('request has not been explicitely allowed and this might be a security issue -> Access Denied')
  }catch(e){
    res.forbidden(e)
  }
}
