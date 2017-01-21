import roles from './roles'


module.exports = {

  roles,
  routes : {
    'GET /test/testAction'        : 'TestController.testAction',
    'GET /nomodel'                : 'NoModelController.testAction',
    'GET /paramRoute/:routeParameter'  : 'TestController.testActionWithParam'
  },
  models : {migrate: 'drop'},
}
