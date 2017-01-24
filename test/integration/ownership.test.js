
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
      s.lift(config)
      .then(() => s.sails.models.nocontroller.create({name : 'nocontroller'}).then(model => {nocontrollerModelInDb = model}))
      .then(() => s.sails.models.user.create({name : 'l1br3'}).then(model => {userInDb = model}))
      .then(() => s.sails.models.test.create(testModel).then(model => {
        testModelInDb = model

        return new Promise((resolve, reject) => {
          model.owner.add(userInDb)
          model.save(err => {
            if(err) reject(err)
            resolve(err)
          })
        })
        .then(() => new Promise((resolve, reject) => {
            model.owners.add(userInDb)
            model.save(err => {
              if(err) reject(err)
              resolve(err)
            })
          })
        )
        .then(() => {
          return new Promise((resolve, reject) => {
            model.nocontroller.add(nocontrollerModelInDb)
            model.save(err => {
              if(err) reject(err)
              resolve(err)
            })
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
