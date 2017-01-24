
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

const testModel = {
  name : 'testName',
  email : 'testEmail',
  password: 'testPassword',
}

describe('Blueprint Integration ::', function(){

  //--------------------
  //------ FIND --------
  //--------------------

  describe('find ::', function() {

    const config = {
      ...mainConfig,
      policies : {
        '*' : false
      },
      permissions : {
        '*' : false,
        test : {
          find : {
            password : false,
            email : 'private',
            updatedAt : 'private'
          }
        }
      }
    }

    before(function (done) {
      s.lift(config)
      .then(done)
      .then(() => {s.sails.models.test.create(testModel).then()})
      .catch(done)
    })

    after(function (done) {
      s.lower()
      .then(done)
    })

    it('should be forbidden to "where" on a private attribute', function(done){
      request(s.sails.hooks.http.app)
      .get('/test?email=testEmail')
      .expect(403)
      .end((err, res) => {
        done(err)
      })
    })

    it('should be forbidden to "sort" on a private attribute', function(done){
      request(s.sails.hooks.http.app)
      .get('/test?sort=email asc')
      .expect(403)
      .end((err, res) => {
        done(err)
      })
    })

    it('should be allowed to "sort" on an allowed attribute', function(done){
      request(s.sails.hooks.http.app)
      .get('/test?sort=name asc')
      .expect(200)
      .end((err, res) => {
        done(err)
      })
    })

    it('should be allowed to "where" on an allowed attribute', function(done){
      request(s.sails.hooks.http.app)
      .get('/test?name=testName')
      .expect(200)
      .end((err, res) => {
        done(err)
      })
    })
  })



  //--------------------
  //------ CREATE ------
  //--------------------

  describe('create::', function() {

    const config = {
      ...mainConfig,
      policies : {
        '*' : false
      },
      permissions : {
        '*' : false,
        test : {
          create : {
            email : false
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

    it('should create a filtered model', function(done){

      const newModel = {
        ...testModel
      }

      request(s.sails.hooks.http.app)
      .post('/test')
      .send(newModel)
      .expect(201)
      .end((err, res) => {
        res.body.should.not.have.ownProperty('email')
        done(err)
      })
    })
  })


  //--------------------
  //------ UPDATE ------
  //--------------------

  describe('update::', function() {

    let modelInDb
    const config = {
      ...mainConfig,
      policies : {
        '*' : false
      },
      permissions : {
        '*' : false,
        test : {
          create : {
            email : false
          }
        }
      }
    }

    before(function (done) {
      s.lift(config)
      .then(done)
      .then(() => {s.sails.models.test.create(testModel).then(model => {modelInDb  = model})})
      .catch(done)
    })

    after(function (done) {
      s.lower()
      .then(done)
    })

    it('should update model', function(done){

      const newModel = {
        ...testModel
      }

      done()

      // request(s.sails.hooks.http.app)
      // .put('/test')
      // .send(newModel)
      // .expect(201)
      // .end((err, res) => {
      //   // res.body.should.not.have.ownProperty('email')
      //   done(err)
      // })
    })
  })

})
