
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
let userToUseInAuth = null
function userPolicy(req, res, next){
  if(userToUseInAuth !== false){
    req.user = userToUseInAuth || {id: 123}
  }
  next()
}


describe('populate/privatePopulate Integration ::', function(){

  let userInDb, userInDb2, petInDb, testInDb, testInDb2

  describe("populate object's private attributes :: ", function() {

    const config = {
      ...mainConfig,
      policies : {
        '*' : [userPolicy]
      },
      permissions : {
        debug : {
          message : true,
          filters: false
        },
        '*' : 'user', // should allow user to create/update his own profile,
        user : {
          populate : {
            pet : 'user'
          },
          find : {
            email : 'private',
            updatedAt : false
          }
        },
        pet : {
          populatePrivateAttributes : true,
          find : {
            type : 'private',
            updatedAt : false
          }
        },
        test : {
          populate : {
            user : 'user'
          }
        }
      }
    }

    const fixtures = async function(){
      // Create user and pet and populate user with pet
      petInDb  = await s.sails.models.pet.create({name  : 'teddy', type:'bear'})
      userInDb = await s.sails.models.user.create({name : 'l1br3'})
      userInDb.pets.add(petInDb)
      await userInDb.save()

      // Create test objects and populate it with user
      testInDb  = await s.sails.models.test.create({name : 'test'})
      testInDb2 = await s.sails.models.test.create({name : 'test', owner : userInDb.id})
      testInDb.users.add(userInDb)
      testInDb2.users.add(userInDb)
      await testInDb.save()
      await testInDb2.save()

      return null
    }

    before(s.start(config, fixtures))
    after(s.stop())
    beforeEach(function(){ userToUseInAuth = null })

    it('should receive non filtered pets when user is owner and pet.populatePrivateAttributes is true', function(done){
      userToUseInAuth = userInDb
      request(s.sails.hooks.http.app)
      .get(`/user/${userInDb.id}/pets`)
      .expect(200)
      .end((err, res) => {
        expect(res.body[0]).to.not.have.ownProperty('updatedAt')
        expect(res.body[0]).to.have.ownProperty('type')
        done(err)
      })
    })

    it('should receive filtered pets when user is NON owner even if pet.populatePrivateAttributes is true', function(done){
      request(s.sails.hooks.http.app)
      .get(`/user/${userInDb.id}/pets`)
      .expect(200)
      .end((err, res) => {
        expect(res.body[0]).to.not.have.ownProperty('updatedAt')
        expect(res.body[0]).to.not.have.ownProperty('type')
        done(err)
      })
    })

    it('should receive filtered users when user is NON owner of populated model', function(done){
      userToUseInAuth = userInDb

      request(s.sails.hooks.http.app)
      .get(`/test/${testInDb.id}/users`)
      .expect(200)
      .end((err, res) => {
        expect(res.body[0]).to.not.have.ownProperty('email')
        expect(res.body[0]).to.not.have.ownProperty('updatedAt')
        done(err)
      })
    })

    it('should receive filtered users when user is owner of populated model and pet.populatePrivateAttributes is not defined', function(done){

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



  describe("NO FILTER on populate object's private attributes when populate.model is true ::", function() {

    const config = {
      ...mainConfig,
      policies : {'*' : [userPolicy]},
      permissions : {
        debug : {filters: true, message: true},
        '*' : 'user', // should allow user to create/update his own profile,
        test : {
          populate : 'user'
        },
        user : {
          populate : true,
          find : {
            email : 'private'
          }
        },
        pet : {
          find : {
            type : false
          }
        }
      }
    }

    const fixtures = async function(){
      petInDb  = await s.sails.models.pet.create({name  : 'teddy', type:'bear'})
      userInDb = await s.sails.models.user.create({name : 'l1br3', email: 'test@mail'})
      userInDb2 = await s.sails.models.user.create({name : 'jean', email: 'test@mail'})
      userInDb.pets.add(petInDb)
      await userInDb.save()

      // Create test objects and populate it with user
      testInDb  = await s.sails.models.test.create({name : 'test'})
      testInDb2 = await s.sails.models.test.create({name : 'test', owner : userInDb.id})
      testInDb.users.add(userInDb)
      testInDb2.users.add(userInDb)
      await testInDb.save()
      await testInDb2.save()

      return null
    }

    before(s.start(config, fixtures))
    after(s.stop())
    beforeEach(function(){ userToUseInAuth = null })

    it('should receive non filtered pets when user is guest and populate policy is true', function(done){
      userToUseInAuth = false
      request(s.sails.hooks.http.app)
      .get(`/user/${userInDb.id}/pets`)
      .expect(200)
      .end((err, res) => {
        expect(res.body[0]).to.have.ownProperty('type')
        done()
      })
    })

    it('should receive non filtered users when req is user and populate policy is user', function(done){
      request(s.sails.hooks.http.app)
      .get(`/test/${testInDb.id}/users`)
      .expect(200)
      .end((err, res) => {
        expect(res.body[0]).to.have.ownProperty('email')
        done()
      })
    })
  })


  describe("filter on populate object's private attributes ::", function() {

    const config = {
      ...mainConfig,
      policies : {'*' : [userPolicy]},
      permissions : {
        '*' : 'user', // should allow user to create/update his own profile,
        user : {
          populate : {
            pets : 'private'
          }
        },
        pet : {
          populatePrivateAttributes : true,
          find : {
            type : 'private',
            updatedAt : false
          }
        }
      }
    }

    const fixtures = async function(){
      petInDb  = await s.sails.models.pet.create({name  : 'teddy', type:'bear'})
      userInDb = await s.sails.models.user.create({name : 'l1br3'})
      userInDb.pets.add(petInDb)
      await userInDb.save()
      return null
    }

    before(s.start(config, fixtures))
    after(s.stop())
    beforeEach(function(){ userToUseInAuth = null })

    it('should receive filtered pets when user is owner and populate policy is private ', function(done){
      userToUseInAuth = userInDb

      request(s.sails.hooks.http.app)
      .get(`/user/${userInDb.id}/pets`)
      .expect(200)
      .end((err, res) => {
        expect(res.body[0]).to.have.ownProperty('type')
        done()
      })
    })

    it('should deny access when user is NOT owner and populate policy is private', function(done){
      userToUseInAuth = userInDb2
      request(s.sails.hooks.http.app)
      .get(`/user/${userInDb.id}/pets`)
      .expect(403)
      .end(done)
    })
  })

  describe("populate object's private attributes without filter(populated model.find)::", function() {

    const config = {
      ...mainConfig,
      policies : {'*' : [userPolicy]},
      permissions : {
        '*' : 'user', // should allow user to create/update his own profile,
        user : {
          populate : {
            pets : 'private'
          }
        },
        pet : {
          anAction : true
        }
      }
    }

    const fixtures = async function(){
      petInDb  = await s.sails.models.pet.create({name  : 'teddy', type:'bear'})
      userInDb = await s.sails.models.user.create({name : 'l1br3'})
      userInDb2 = await s.sails.models.user.create({name : 'anUser'})
      userInDb.pets.add(petInDb)
      await userInDb.save()
      return null
    }

    before(s.start(config, fixtures))
    after(s.stop())
    beforeEach(function(){ userToUseInAuth = null })

    it('should receive UNFILTERED pets when user is owner and populate policy is private and no filter is defined', function(done){
      userToUseInAuth = userInDb

      request(s.sails.hooks.http.app)
      .get(`/user/${userInDb.id}/pets`)
      .expect(200)
      .end((err, res) => {
        expect(res.body[0]).to.have.ownProperty('name')
        expect(res.body[0]).to.have.ownProperty('type')
        expect(res.body[0]).to.have.ownProperty('id')
        expect(res.body[0]).to.have.ownProperty('createdAt')
        expect(res.body[0]).to.have.ownProperty('updatedAt')
        done()
      })
    })

    it('should deny access when user is NOT owner and populate policy is private', function(done){
      userToUseInAuth = userInDb2
      request(s.sails.hooks.http.app)
      .get(`/user/${userInDb.id}/pets`)
      .expect(403)
      .end(done)
    })
  })
})
