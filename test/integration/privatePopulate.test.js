
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

function auth(req, res, next){
  s.sails.models.user.findOne({name : 'l1br3'})
  .then(user => {
    req.user = user
    next()
  })
}

describe('Populate filter Integration ::', function(){

  //--------------------
  //------ FIND --------
  //--------------------

  describe('populate a user ::', function() {

    let userInDb, petInDb

    const config = {
      ...mainConfig,
      policies : {
        '*' : [userPolicy]
      },
      permissions : {
        '*' : 'user', // should allow user to create/update his own profile,
        user : {
          populate : {}
        },
        pet : {
          find : {
            type : 'private',
            updatedAt : false
          }
        }
      }
    }

    before(function (done) {

      async function lift(){
        try{
          await s.lift(config)
          petInDb  = await s.sails.models.pet.create({name  : 'teddy', type:'bear'})
          userInDb = await s.sails.models.user.create({name : 'l1br3'})
          userInDb.pets.add(petInDb)
          await userInDb.save()
          return null

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

    it('should receive filtered pets', function(done){

      request(s.sails.hooks.http.app)
      .get(`/user/${userInDb.id}/pets`)
      .expect(200)
      .end((err, res) => {
        expect(res.body[0]).to.not.have.ownProperty('updatedAt')
        expect(res.body[0]).to.not.have.ownProperty('type')
        done(err)
      })
    })
  })



  describe('populate another object ::', function() {

    let userInDb, testInDb, testInDb2

    const config = {
      ...mainConfig,
      policies : {
        '*' : [auth]
      },
      permissions : {
        '*' : 'user', // should allow user to create/update his own profile,
        test : {
          populate : {}
        },
        user : {
          find : {
            email : 'private',
            updatedAt : false
          }
        }
      }
    }

    before(function (done) {

      async function lift(){
        try{
          await s.lift(config)
          userInDb  = await s.sails.models.user.create({name : 'l1br3', email : 'l1br3@github.com'})
          testInDb  = await s.sails.models.test.create({name : 'test'})
          testInDb2 = await s.sails.models.test.create({name : 'test', owner : userInDb.id})
          testInDb.users.add(userInDb)
          testInDb2.users.add(userInDb)
          await testInDb.save()
          await testInDb2.save()
          return null

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

    it('should receive filtered users when user is NON owner of populated model', function(done){

      request(s.sails.hooks.http.app)
      .get(`/test/${testInDb.id}/users`)
      .expect(200)
      .end((err, res) => {
        expect(res.body[0]).to.not.have.ownProperty('email')
        expect(res.body[0]).to.not.have.ownProperty('updatedAt')
        done(err)
      })
    })

    it('should receive filtered users when user is owner of populated model', function(done){

      request(s.sails.hooks.http.app)
      .get(`/test/${testInDb2.id}/users`)
      .expect(200)
      .end((err, res) => {
        expect(res.body[0]).to.not.have.ownProperty('email')
        expect(res.body[0]).to.not.have.ownProperty('updatedAt')
        done(err)
      })
    })
  })
})
