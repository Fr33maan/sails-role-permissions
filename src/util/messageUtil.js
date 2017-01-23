
const defaultMessages = {
  notFound           : 'global permissions set to false and controller has no permissions set',
  setToFalse         : 'is set to false',
  setToGuest         : 'is set to guest and req is ',
  forbiddenForGuests : 'guest are not allowed',
  roleIsTooLow       : 'asked role is below user permission'
}

export default {

  generateControllerErrorMessages : function(controller, reqRole, askedRole){

    const baseMsg = `Controller Error => ${controller} : `

    return {
      notFound           : baseMsg + 'global permissions set to false and controller has no permissions set',
      setToFalse         : baseMsg + 'controller ' + defaultMessages.setToFalse,
      setToGuest         : baseMsg + 'controller ' +defaultMessages.setToGuest + reqRole,
      forbiddenForGuests : baseMsg + defaultMessages.forbiddenForGuests,
      roleIsTooLow       : baseMsg + defaultMessages.roleIsTooLow + ` (reqRole = ${reqRole} && askedRole = ${askedRole})`
    }

  },


  generateActionErrorMessages: function(controller, action, reqRole, askedRole){

    const baseMsg = `Action Error ${controller}::${action} (controller::action) : `

    return {
      notFound           : baseMsg + 'global permissions set to false and action has no permissions set',
      setToFalse         : baseMsg + 'action ' + defaultMessages.setToFalse,
      setToGuest         : baseMsg + 'action ' + defaultMessages.setToGuest + reqRole,
      forbiddenForGuests : baseMsg + defaultMessages.forbiddenForGuests,
      roleIsTooLow       : baseMsg + defaultMessages.roleIsTooLow + ` (reqRole = ${reqRole} && askedRole = ${askedRole})`
    }

  },

  generateAttributeErrorMessages: function(controller, action, attribute, reqRole, askedRole){

    const baseMsg = `Attribute Error ${controller}::${action}::${attribute} (controller::action::attribute) : `

    return {
      notFound           : baseMsg + 'global permissions set to false and action has no permissions set',
      setToFalse         : baseMsg + 'attribute ' + defaultMessages.setToFalse,
      setToGuest         : baseMsg + 'attribute ' + defaultMessages.setToGuest + reqRole,
      forbiddenForGuests : baseMsg + defaultMessages.forbiddenForGuests,
      roleIsTooLow       : baseMsg + defaultMessages.roleIsTooLow + ` (reqRole = ${reqRole} && askedRole = ${askedRole})`
    }

  }

}
