import modelsPolicy from './modelsPolicy'
import actionsPolicy from './actionsPolicy'


export default function(req, res, next){

  function wrapper(fn){
      return fn(req)
  }

  modelsPolicy(req)
  .then(wrapper(actionsPolicy))
  .then(next)
}
