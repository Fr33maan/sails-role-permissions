'use strict';

var controllerDefaultRejectionMessage = 'req is not allowed to use this controller --- reason: ';
var actionDefaultRejectionMessage = 'req is not allowed to use this action --- reason: ';

module.exports = {

  controllerNotFound: controllerDefaultRejectionMessage + 'global permissions set to false and controller has no permissions set',
  controllerSetToFalse: controllerDefaultRejectionMessage + 'controller is set to false',
  controllerSetToGuest: controllerDefaultRejectionMessage + 'asked role is guest and req is',
  controllerForbiddenForGuests: controllerDefaultRejectionMessage + 'guest are not allowed',
  controllerRankIsTooLow: controllerDefaultRejectionMessage + 'asked role is above user permission',

  actionNotFound: actionDefaultRejectionMessage + 'global permissions set to false and action has no permissions set',
  actionSetToFalse: actionDefaultRejectionMessage + 'action is set to false',
  actionSetToGuest: actionDefaultRejectionMessage + 'asked role is guest and req is',
  actionForbiddenForGuests: actionDefaultRejectionMessage + 'guest are not allowed',

  notFound: 'global permissions set to false and controller has no permissions set',
  setToFalse: 'set to false',
  setToGuest: 'set to guest and req is ',
  forbiddenForGuests: 'guest are not allowed',
  roleIsTooLow: 'asked role is below user permission'

};