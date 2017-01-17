import controllersPolicy  from './controllersPolicy'
import actionsPolicy      from './actionsPolicy'


export default function(req, res, next, injectedSails){

  let _sails = sails || injectedSails

  function wrapper(fn){
      return fn(req, res, _sails)
  }

  try{
    controllersPolicy(req, res, _sails)

    next()
  }catch(e){
    res.forbidden(e)
  }
}
