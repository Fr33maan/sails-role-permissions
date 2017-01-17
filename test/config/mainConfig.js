import roles from './roles'


module.exports = {

  roles,
  routes : {
    'GET /test/testAction' : 'TestController.testAction',
    'GET /nomodel' : 'NoModelController.testAction'
  },
  models : {migrate: 'drop'}
}
