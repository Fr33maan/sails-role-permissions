
import roleUtil from '../util/roleUtil'
import messageUtil from '../util/messageUtil'
import policyMethods from './policyMethods'


export default class controllersPolicy extends policyMethods {

  constructor(req, config){

    super()

    const controller = req.options.controller

    this.config    = config
    this.reqRole   = req.user ? (req.user.role || 'user') : 'guest'
    this.askedRole = config[controller] || config.all

    this.container = config
    this.policy = config[controller]
    this.policyName = controller

    this.errorMessages = messageUtil.generateControllerErrorMessages(controller, this.reqRole, this.askedRole)
  }
}
