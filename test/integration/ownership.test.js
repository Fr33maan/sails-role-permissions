
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

// Authenticate user at each request
function userPolicy(req, res, next){
  if(req.body && req.body.auth === 'user'){
    s.sails.models.user.findOne({name : 'l1br3'})
    .then(user => {
      req.user = user
      next()
    })

  }else if(req.body && req.body.auth === 'admin'){
    req.user = {
      role : 'admin',
      id: 'anyway'
    }
    next()

  }else{
    //Implicit roling but not owner
    req.user = {
      id : 123
    }
    next()
  }
}

describe('Ownership Integration ::', function(){

  //--------------------
  //------ FIND --------
  //--------------------

  describe('update as owner ::', function() {

    function save(model){
      return new Promise((resolve, reject) => {
        model.save(err => {
          if(err) reject(err)
          resolve()
        })
      })
    }


    let userInDb, testModelInDb, nocontrollerModelInDb

    const config = {
      ...mainConfig,
      policies : {
        '*' : [userPolicy]
      },
      permissions : {
        '*' : 'user', // should allow user to create/update his own profile,
        test : {
          update : {}
        },
        user : {
          populate : {
            tests : 'private',
            pets : true
          },
          add : {
            pets : 'private'
          },
          remove : 'private',
          update : {}
        }
      }
    }

    before(function (done) {

      async function lift(){
        try{
          await s.lift(config)
          nocontrollerModelInDb = await s.sails.models.nocontroller.create({name : 'nocontroller'})
          userInDb              = await s.sails.models.user.create({name         : 'l1br3'})
          testModelInDb         = await s.sails.models.test.create(testModel)
          testModelInDb.owner.add(userInDb)
          testModelInDb.nocontroller.add(nocontrollerModelInDb)
          await save(testModelInDb)

        }catch(e){
          return e
        }
      }

      lift()
      .then(done)
      .catch(done)
    })

    after(function (done) {
      s.lower()
      .then(done)
      .catch(done)
    })

    it('should be able to update owned model', function(done){

      request(s.sails.hooks.http.app)
      .put(`/test/${testModelInDb.id}`)
      .send({
        name : 'newName',
        auth : 'user'
      })
      .expect(200)
      .end((err, res) => {
        res.body.name.should.equal('newName')
        done(err)
      })
    })

    it('should be able to update own profile', function(done){

      request(s.sails.hooks.http.app)
      .put(`/user/${userInDb.id}`)
      .send({
        favoritePet : 'unicorn',
        auth : 'user'
      })
      .expect(200)
      .end((err, res) => {
        res.body.favoritePet.should.equal('unicorn')
        done(err)
      })
    })


    describe('dependant tests', function(){
      it('should be able to add pet to own user', function(done){

        request(s.sails.hooks.http.app)
        .post(`/user/${userInDb.id}/pets`)
        .send({
          name : 'peewee',
          type : 'bear',
          auth : 'user'
        })
        .expect(200)
        .end((err, res) => {
          done(err)
        })
      })

      it('should be able to remove pet from own user', function(done){

        s.sails.models.user.findOne(userInDb.id).populate('pets')
        .then(user => {
          request(s.sails.hooks.http.app)
          .delete(`/user/${userInDb.id}/pets/${user.pets[0].id}`)
          .send({auth : 'user'})
          .expect(200)
          .end(done)
        })
        .catch(done)
      })
    })

    it('should be able to update NON owned model when admin', function(done){

      request(s.sails.hooks.http.app)
      .put(`/test/${testModelInDb.id}`)
      .send({
        name : 'newName2',
        auth : 'admin'
      })
      .expect(200)
      .end((err, res) => {
        res.body.name.should.equal('newName2')
        done(err)
      })
    })


    it('should be able to populate NON owned user', function(done){

      request(s.sails.hooks.http.app)
      .get(`/user/${userInDb.id}/pets`)
      .expect(200)
      .end((err, res) => {
        done(err)
      })
    })

    it('should NOT be able to update user profile', function(done){

      new Promise(resolve => {
        s.sails.models.user.create({name : 'toto'})
        .then(resolve)
      })
      .then(user => {
        request(s.sails.hooks.http.app)
        .put(`/user/${user.id}`)
        .send({
          name : 'newName',
          auth : 'user'
        })
        .expect(403)
        .end(done)
      })
      .catch(done)
    })


    it('should NOT be able to update NON owned model', function(done){

      request(s.sails.hooks.http.app)
      .put(`/test/${testModelInDb.id}`)
      .send({
        name : 'newName2'
      })
      .expect(403)
      .end((err, res) => {
        done(err)
      })
    })

    it('should NOT be able to populate NON owned user', function(done){

      request(s.sails.hooks.http.app)
      .get(`/user/${userInDb.id}/tests`)
      .expect(403)
      .end((err, res) => {
        done(err)
      })
    })

    it('should NOT be able to add pet to NON owned user', function(done){

      request(s.sails.hooks.http.app)
      .post(`/user/${userInDb.id}/pets`)
      .send({
        type : 'unicorn'
      })
      .expect(403)
      .end((err, res) => {
        done(err)
      })
    })

    it('should NOT be able to remove pet from NON owned user', function(done){

      request(s.sails.hooks.http.app)
      .delete(`/user/${userInDb.id}/pets/456`)
      .expect(403)
      .end((err, res) => {
        done(err)
      })
    })
  })
})
