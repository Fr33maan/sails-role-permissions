
const controllerDefaultRejectionMessage = 'req is not allowed to use this controller --- reason: '

module.exports = {

  controllerNotFound           : controllerDefaultRejectionMessage + 'global permissions set to false and controller has no permissions set',
  controllerSetToFalse         : controllerDefaultRejectionMessage + 'controller is set to false',
  controllerSetToGuest         : controllerDefaultRejectionMessage + 'asked role is guest and req is',
  controllerForbiddenForGuests : controllerDefaultRejectionMessage + 'guest are not allowed',
  controllerRankIsTooLow       : controllerDefaultRejectionMessage + 'asked role is above user permission'

}
