
// External modules
import { Sails }    from 'sails'
import request      from 'supertest'
import sinon        from 'sinon'
import { assert, expect, should }   from 'chai'
should()

// Utils and config
import SailsServer  from '../util/SailsServer'
import mainConfig   from '../config/mainConfig'

// Internal module code
import permissionPolicies from '../../src/policies'
import defaultRoles       from '../../src/config/defaultRoles'

let s = new SailsServer()

const testControllerPolicy = function(req, res, next){next()}
const testModel = {
  name : 'testName',
  email : 'testEmail',
  password: 'testPassword'
}



describe('allowAll (explicit / config.policies) ::', function() {

  const config = {
    ...mainConfig,
    policies : {
      '*' : true,
      testController : [testControllerPolicy]
    },
    permissions : {
      roles : [
        ...defaultRoles,
        'guest' //Set it to test if it is correctly removed
      ]
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



  // Test that Sails can lift with the hook in place
  it ('sails does not crash', function() {
    return true;
  })


  it('should set default roles if they are not set in the sails.config.permissions.roles', function(){
    expect(s.sails.config.permissions.roles).to.eql(defaultRoles)
    expect(s.sails.config.permissions.roles).to.not.contain('guest') // This must be removed from roles array
  })


  it('should add role-permission policy to all controllers set in sails.config.policies', function(){

    // Check that policies have been changed
    const policies = s.sails.config.policies
    policies['*'].should.not.be.a.boolean
    policies['*'].should.be.a.function
    expect(policies.testController.length).to.equal(2)
    expect(s.sails.config.permissions['*']).to.exist
    expect(s.sails.config.permissions['*']).to.equal(true)

    // Check that additional policy is sails-hook-role-permission policy
    expect(policies['*'][0].toString()).to.equal(permissionPolicies.toString())
    expect(policies.testController[1].toString()).to.equal(permissionPolicies.toString())

    // Check that previous policies still exist
    expect(policies.testController[0].toString()).to.equal(testControllerPolicy.toString())
  })

  it('should have made the config route available', function(done){
    request(s.sails.hooks.http.app)
    .get('/nomodel')
    .expect(200)
    .end((err, res) => {
      done(err)
    })
  })

  it('should have made the config route available', function(done){
    request(s.sails.hooks.http.app)
    .get('/test/testAction')
    .expect(200)
    .end((err, res) => {
      done(err)
    })
  })

  it('should have made the create blueprint route available', function(done){
    request(s.sails.hooks.http.app)
    .post('/test')
    .send(testModel)
    .expect(201)
    .end((err, res) => {
      done(err)
    })
  })

  it('should have made the find blueprint route available', function(done){
    request(s.sails.hooks.http.app)
    .get('/test')
    .expect(200)
    .end((err, res) => {
      expect(res.body.length).to.equal(1)
      expect(res.body[0].name).to.equal(testModel.name)
      done(err)
    })
  })
})



describe('denyAll ::', function() {

  const config = {
    ...mainConfig,
    policies : {
      '*' : false,
      testController : [testControllerPolicy]
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



  // Test that Sails can lift with the hook in place
  it ('sails does not crash', function() {
    return true;
  })


  it('should add role-permission policy to all controllers set in sails.config.policies', function(){

    // Check that policies have been changed
    expect(s.sails.config.permissions['*']).to.equal(false)
    expect(s.sails.config.permissions['all']).to.equal(false)
  })

  it('should have made the config route available', function(done){
    request(s.sails.hooks.http.app)
    .get('/nomodel')
    .expect(403)
    .end((err, res) => {
      done(err)
    })
  })

  it('should have made the config route available', function(done){
    request(s.sails.hooks.http.app)
    .get('/test/testAction')
    .expect(403)
    .end((err, res) => {
      done(err)
    })
  })

  it('should have made the create blueprint route available', function(done){
    request(s.sails.hooks.http.app)
    .post('/test')
    .send(testModel)
    .expect(403)
    .end((err, res) => {
      done(err)
    })
  })

  it('should have made the find blueprint route available', function(done){
    request(s.sails.hooks.http.app)
    .get('/test')
    .expect(403)
    .end((err, res) => {
      done(err)
    })
  })
})
