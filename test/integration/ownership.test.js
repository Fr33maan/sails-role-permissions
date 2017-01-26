
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

function userPolicy(req, res, next){

  s.sails.models.user.find()
  .then(user => {
    req.user = user[0]
    next()
  })
}

describe('Ownership Integration ::', function(){

  //--------------------
  //------ FIND --------
  //--------------------

  describe('update as owner ::', function() {

    let userInDb, testModelInDb, nocontrollerModelInDb

    const config = {
      ...mainConfig,
      policies : {
        '*' : [userPolicy]
      },
      permissions : {
        '*' : true
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
          testModelInDb.owners.add(userInDb)
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

    it('should ', function(done){

      request(s.sails.hooks.http.app)
      .get(`/test`)
      .expect(200)
      .end((err, res) => {
        done(err)
      })
    })
  })
})
