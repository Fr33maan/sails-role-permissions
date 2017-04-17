/**
 * parameterPolicy
 *
 * @description :: policy used for some blueprint actions (populate, add, remove)
 */

 import messageUtil   from '../util/messageUtil'
 import policyMethods from './policyMethods'


 export default class parametersPolicy extends policyMethods {

   constructor(req, config, isOwner){

     super()

     const controller = req.options.controller
     let action       = req.options.action

     // Take find config if no findOne config is provided
     if(action === 'findOne' && !config[controller].findOne && config[controller].find) action = 'find'

     this.action = action
     const attribute = req.options.alias

     this.config    = config
     this.reqRole   = req.user ? (req.user.role || 'user') : 'guest'
     this.askedRole = config[controller][action][attribute] || config.all

     this.container = config[controller][action]

     if(typeof this.container === 'object'){
       this.policy = config[controller][action][attribute]
     }else{
       this.policy = config[controller][action]
     }

     this.isOwner = isOwner

     this.policyName = attribute

     this.errorMessages = messageUtil.generateAttributeErrorMessages(controller, action, attribute, this.reqRole, this.askedRole)
   }

   customPreCheck(){
     // Check if action is something else than add, remove or populate and go to next policy if so - do it as soon as possible
     return (this.action !== 'add' && this.action !== 'remove' && this.action !== 'populate')
   }

   check(){
     if(this.customPreCheck && this.customPreCheck()) return false // Pending
     this.configRoleUtil()
     if(this.policyIsObject()) return true // Filter
     if(this.policyIsPrivate()) return this.isOwner // Pending or filter
     if(this.wildcardIsTrue()) return true  // Filter

     this.wildcardFalseAndNoBypass() // Throw Deny
     this.policyIsFalse()            // Throw Deny

     if(this.wildcardAsRole()) return true  // Filter - Throw deny
     if(this.policyIsGuest())  return true  // Filter - Throw deny

     this.reqIsGuest()   // Throw Deny
     if(this.policyIsRole())  return true  // Filter - Throw deny

     return false // Policy not covered - Pending
   }


 }

/*
Add to blueprints params =>
remove from blueprints params =>
{
  parentId : "holder model pk",
  id : "model to associate pk"
}
+ req.options.associations[].collection


Destroy blueprints params =>
findOne blueprints params =>
{
  id : "model to destroy pk"
}


populate blueprints params =>
{
  parentId : "holder model pk to populate",
  id : "will be undefined",
}

*/
