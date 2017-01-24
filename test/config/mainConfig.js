import roles from './roles'


module.exports = {

  roles,
  routes : {
    'GET /test/testAction'             : 'TestController.testAction',
    'GET /nomodel_test'                : 'NoModelController.testAction',
    'GET /paramRoute/:routeParameter'  : 'TestController.testActionWithParam'
  },
  connections : {mongo : {
    adapter: 'sails-mongo',
    database: 'sails-hook-role-permissions'
  }},
  models : {migrate: 'drop', connection : 'mongo'},
}
