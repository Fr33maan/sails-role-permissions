
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
  password: 'testPassword',
}
let nocontrollerModelInDb, testModelInDb



describe('hook initialization allowAll (explicit / config.policies) :: ', function() {

  const config = {
    ...mainConfig,
    policies : {
      '*' : true,
      testController : [testControllerPolicy],
      anotherController : {
        action : [testControllerPolicy]
      }
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

    // Create a model to link to
    .then(() => {s.sails.models.nocontroller.create({name : 'nocontroller'}).then(model => {nocontrollerModelInDb = model})})
    .then(() => {s.sails.models.test.create({name : 'testModel'}).then(model => {testModelInDb = model})})
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

    // Check that action policies still exists
    const actionPolicies = policies.anotherController.action
    expect(actionPolicies).to.be.a('array')
    expect(actionPolicies[0].toString()).to.equal(testControllerPolicy.toString())
    expect(actionPolicies[1].toString()).to.equal(permissionPolicies.toString())
  })


  // ----------------
  // ---- CONFIG ----
  // ----------------
  describe('some routes in config', function(){

    it('should have made the config route available', function(done){
      request(s.sails.hooks.http.app)
      .get('/nomodel_test')
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

    it('should have made the custom route available', function(done){
      request(s.sails.hooks.http.app)
      .get('/paramRoute/parameterValue')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.eql({routeParameter : 'parameterValue'})
        done(err)
      })
    })
  })


  // ---------------
  // ---- OTHER ----
  // ---------------

  describe('blueprints (no find/create) lifecycle', function(){

    it('should have made the add to blueprint route available', function(done){
      request(s.sails.hooks.http.app)
      .post(`/test/${testModelInDb.id}/nocontroller/${nocontrollerModelInDb.id}`)
      .send()
      .expect(200)
      .end((err, res) => {
        done(err)
      })
    })

    it('should have made the populate route available', function(done){
      request(s.sails.hooks.http.app)
      .get(`/test/${testModelInDb.id}/nocontroller`)
      .expect(200)
      .end((err, res) => {
        done(err)
      })
    })

    it('should have made the remove from blueprint route available', function(done){
      request(s.sails.hooks.http.app)
      .delete(`/test/${testModelInDb.id}/nocontroller/${nocontrollerModelInDb.id}`)
      .expect(200)
      .end((err, res) => {
        done(err)
      })
    })

    it('should have made the findOne route available', function(done){
      request(s.sails.hooks.http.app)
      .get('/test/' + testModelInDb.id)
      .expect(200)
      .end((err, res) => {
        done(err)
      })
    })

    it('should have made the destroy blueprint route available', function(done){
      request(s.sails.hooks.http.app)
      .delete(`/test/${testModelInDb.id}`)
      .expect(200)
      .end((err, res) => {
        done(err)
      })
    })
  })




  // ---------------------
  // ---- FIND/CREATE ----
  // ---------------------

  describe('create/find blueprint', function(){
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

  it('should have made the config route available - deny nomodel', function(done){
    request(s.sails.hooks.http.app)
    .get('/nomodel_test')
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
