

import messageUtil from '../util/messageUtil'
import policyMethods from './policyMethods'


export default class actionsPolicy extends policyMethods {

  constructor(req, config){

    super()

    const controller = req.options.controller
    let action       = req.options.action

    // Take find config if no findOne config is provided
    if(action === 'findOne' && !config[controller].findOne && config[controller].find) action = 'find'

    this.config    = config
    this.reqRole   = req.user ? (req.user.role || 'user') : 'guest'
    this.askedRole = config[controller][action] || config.all

    this.container = config[controller]
    this.policy = config[controller][action]
    this.policyName = action

    this.errorMessages = messageUtil.generateActionErrorMessages(controller, action, this.reqRole, this.askedRole)
  }
}
