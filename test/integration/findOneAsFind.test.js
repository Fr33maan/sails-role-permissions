
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

describe('findAsFindOneConfig Integration ::', function(){

  //--------------------
  //------ FIND --------
  //--------------------

  describe('find as findOne config ::', function() {

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


    it('test find as findOne config ', function(done){

      request(s.sails.hooks.http.app)
      .get(`/test/${testModelInDb.id}`)
      .expect(200)
      .end((err, res) => {
        res.body.should.have.ownProperty('name')

        res.body.should.not.have.ownProperty('email')
        res.body.should.not.have.ownProperty('updatedAt')
        res.body.should.not.have.ownProperty('nocontroller')
        res.body.should.not.have.ownProperty('password')
        done(err)
      })
    })
  })
})
