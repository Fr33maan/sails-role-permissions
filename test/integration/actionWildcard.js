
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

describe('actionWildcard :: should be denied for user to use a guest action with specific parameters', function(){

  function auth(req, res, next){
    if(req.body.role) req.user = {role : req.body.role}
    delete req.body.role
    next()
  }

  const config = {
    ...mainConfig,
    policies : {'*' : [auth]},
    permissions : {
      all : false,
      test : {
        create : {
          '*' : 'guest',
          email : false,
        }
      }
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

  it('should be forbidden for user if wildcard is set to guest', function(done){
    request(s.sails.hooks.http.app)
    .post('/test')
    .send({name : 'l1br3', role :'user'}) // We use req.body to parameter auth policy in this test
    .expect(403)
    .end((err, res) => {
      done(err)
    })
  })

  it('should be allowed for guest to create (email should not be editable)', function(done){
    request(s.sails.hooks.http.app)
    .post('/test')
    .send({
      name : 'l1br3',
      email : 'testEmail'
    })
    .expect(201)
    .end((err, res) => {
      expect(res.body.name).to.eql('l1br3')
      res.body.should.not.have.ownProperty.email
      done(err)
    })
  })

  it('should be allowed for admin to bypass role wildcard (email should not be editable)', function(done){
    request(s.sails.hooks.http.app)
    .post('/test')
    .send({
      name : 'l1br3', role :'admin',  // We use req.body to parameter auth policy in this test
      email : 'testEmail'
    })
    .expect(201)
    .end((err, res) => {
      res.body.should.not.have.ownProperty.email
      done(err)
    })
  })
})
