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


// function modelsPolicy(req, res, next){
//
//
//
// }
//
//
// export default class PermissionsPolicies {
//
//   constructor(){
//
//     return this.policiesAggregator()
//
//   }
//
//   policiesAggregator(){
//
//
//     return function(req, res, next){
//
//       console.log('called')
//
//       next()
//     }
//   }
// }
