
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

    let nocontrollerModelInDb, testModelInDb

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
            updatedAt : 'private',
            nocontroller : false
          },
          findOne : {
            email : 'private'
          }
        }
      }
    }

    before(function (done) {
      s.lift(config)
      .then(() => s.sails.models.nocontroller.create({name : 'nocontroller'}).then(model => {nocontrollerModelInDb = model}))
      .then(() => s.sails.models.test.create(testModel).then(model => {
        testModelInDb = model

        return new Promise((resolve, reject) => {
          model.nocontroller.add(nocontrollerModelInDb)
          model.save(err => {
            if(err) reject(err)
            resolve(err)
          })
        })

      }))
      .then(done)
      .catch(done)
    })

    after(function (done) {
      s.lower()
      .then(done)
      .catch(done)
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

    it('test find with request', function(done){

      request(s.sails.hooks.http.app)
      // .get(`/test`)
      .get(`/test?populate=nocontroller`)
      .expect(200)
      .end((err, res) => {
        const model = res.body[0]
        model.should.have.ownProperty('owner')
        model.should.have.ownProperty('owners')
        model.should.have.ownProperty('name')
        model.should.have.ownProperty('createdAt')
        model.should.have.ownProperty('id')
        model.should.not.have.ownProperty('nocontroller')
        model.should.not.have.ownProperty('updatedAt')
        model.should.not.have.ownProperty('password')
        model.should.not.have.ownProperty('email')
        done(err)
      })
    })

    it('test findOne', function(done){

      request(s.sails.hooks.http.app)
      .get(`/test/${testModelInDb.id}`)
      .expect(200)
      .end((err, res) => {
        res.body.should.not.have.ownProperty('email')
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
          },
          update : {}
        }
      }
    }

    before(function (done) {
      s.lift(config)
      .then(() => s.sails.models.test.create(testModel).then(model => {modelInDb = model}))
      .then(done)
      .catch(done)
    })

    after(function (done) {
      s.lower()
      .then(done)
    })

    it('should not update model as req is not owner', function(done){

      const newModel = {
        ...testModel
      }

      request(s.sails.hooks.http.app)
      .put(`/test/${modelInDb.id}`)
      .send(newModel)
      .expect(403)
      .end((err, res) => {
        done(err)
      })
    })


    it('should not update model as req is not owner', function(done){

      const newModel = {
        ...testModel
      }

      request(s.sails.hooks.http.app)
      .put(`/test/inexistantId`)
      .send(newModel)
      .expect(403)
      .end((err, res) => {
        done(err)
      })
    })
  })

})
