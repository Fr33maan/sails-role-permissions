
// External modules
import { Sails }    from 'sails'
import { assert, expect, should }   from 'chai'
import sinon        from 'sinon'
import request      from 'supertest'

// Utils and config
import SailsServer  from '../util/SailsServer'
import mainConfig   from '../config/mainConfig'

// Internal modules
import permissionsPolicies from '../../src/policies'

let s = new SailsServer()
let role

describe('customRoles :: ', function(){

  function auth(req, res, next){
    req.user = {role}
    next()
  }

  const config = {
    ...mainConfig,
    policies : {'*' : [auth]},
    permissions : {
      debug : {
        message : false,
        stack : false,
        filters : false
      },

      all: false,
      noModel: {
        allowAccess: 'customRole2',
        denyAccess: 'customRole1',
      },
      roles: [
        'admin',
        'customRole1',
        'customRole2'
      ],
    },
    routes: {
      'GET /allowAccess': 'NoModelController.allowAccess',
      'GET /denyAccess': 'NoModelController.denyAccess',
    }
  }

  before(function (done) {
    s.lift(config)
    .then(done)
    .catch(done)
  })

  after(function (done) {
    s.lower()
    .then(done)
  })

  it('should allow access for customRole2 when policy permission is set to customRole2', function(done){
    role = 'customRole2'
    request(s.sails.hooks.http.app)
    .get('/allowAccess')
    .send()
    .expect(200)
    .end(done)
  })

  it('should deny access for customRole2 when policy permission is set to customRole1 (above customRole2)', function(done){
    role = 'customRole2'
    request(s.sails.hooks.http.app)
    .get('/denyAccess')
    .send()
    .expect(403)
    .end(done)
  })
})
