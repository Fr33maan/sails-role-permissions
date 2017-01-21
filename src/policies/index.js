import controllersPolicy  from './controllersPolicy'
import actionsPolicy      from './actionsPolicy'


export default function(req, res, next, injectedConfig){

  let config = sails ? sails.config.permissions : injectedConfig


  try{
    if(controllersPolicy(req, config))  return next() //Bypass other policies if policy returns true
    if(actionsPolicy(req, config))      return next()
    // parameters policy

    // check attributes -> set filters

    // check find / create
    // apply filters before / after

    // caching

    throw new Error('request has not been explicitely allowed and this might be a security issue -> Access Denied')
  }catch(e){
    res.forbidden(e)
  }
}
