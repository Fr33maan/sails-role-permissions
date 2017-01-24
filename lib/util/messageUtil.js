'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var defaultMessages = {
  notFound: 'global permissions set to false and controller has no permissions set',
  setToFalse: 'is set to false',
  setToGuest: 'is set to guest and req is ',
  forbiddenForGuests: 'guest are not allowed',
  roleIsTooLow: 'asked role is below user permission'
};

exports.default = {

  generateControllerErrorMessages: function generateControllerErrorMessages(controller, reqRole, askedRole) {

    var baseMsg = 'Controller Error => ' + controller + ' : ';

    return {
      notFound: baseMsg + 'global permissions set to false and controller has no permissions set',
      setToFalse: baseMsg + 'controller ' + defaultMessages.setToFalse,
      setToGuest: baseMsg + 'controller ' + defaultMessages.setToGuest + reqRole,
      forbiddenForGuests: baseMsg + defaultMessages.forbiddenForGuests,
      roleIsTooLow: baseMsg + defaultMessages.roleIsTooLow + (' (reqRole = ' + reqRole + ' && askedRole = ' + askedRole + ')')
    };
  },

  generateActionErrorMessages: function generateActionErrorMessages(controller, action, reqRole, askedRole) {

    var baseMsg = 'Action Error ' + controller + '::' + action + ' (controller::action) : ';

    return {
      notFound: baseMsg + 'global permissions set to false and action has no permissions set',
      setToFalse: baseMsg + 'action ' + defaultMessages.setToFalse,
      setToGuest: baseMsg + 'action ' + defaultMessages.setToGuest + reqRole,
      forbiddenForGuests: baseMsg + defaultMessages.forbiddenForGuests,
      roleIsTooLow: baseMsg + defaultMessages.roleIsTooLow + (' (reqRole = ' + reqRole + ' && askedRole = ' + askedRole + ')')
    };
  },

  generateAttributeErrorMessages: function generateAttributeErrorMessages(controller, action, attribute, reqRole, askedRole) {

    var baseMsg = 'Attribute Error ' + controller + '::' + action + '::' + attribute + ' (controller::action::attribute) : ';

    return {
      notFound: baseMsg + 'global permissions set to false and action has no permissions set',
      setToFalse: baseMsg + 'attribute ' + defaultMessages.setToFalse,
      setToGuest: baseMsg + 'attribute ' + defaultMessages.setToGuest + reqRole,
      forbiddenForGuests: baseMsg + defaultMessages.forbiddenForGuests,
      roleIsTooLow: baseMsg + defaultMessages.roleIsTooLow + (' (reqRole = ' + reqRole + ' && askedRole = ' + askedRole + ')')
    };
  },

  criteriaErrorMessages: function criteriaErrorMessages(attribute) {
    return {
      where: attribute + ' is forbidden in \'where\' request clause',
      sort: attribute + ' is forbidden in \'sort\' request clause'
    };
  }

};