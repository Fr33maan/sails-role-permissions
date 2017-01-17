
// External modules
import { Sails }    from 'sails'
import request      from 'supertest'
import { assert, expect, should }   from 'chai'
import sinon        from 'sinon'

// Utils and config
import SailsServer  from '../util/SailsServer'
import mainConfig   from '../config/mainConfig'

// Internal modules
import permissionsPolicies from '../../src/policies'

let s = new SailsServer()

const testModel = {
  name : 'testName',
  email : 'testEmail',
  password: 'testPassword',
}

describe('Basic tests ::', function() {

    const config = {
      ...mainConfig,
      policies : {'*' : false}
    }

    before(function (done) {
      s.lift(config)
      .then(() => {s.sails.models.test.create(testModel)})
      .then(done)
      .catch(done)
    })

    after(function (done) {
      s.lower()
      .then(done)
    })


  describe('denyAll tests', function(){

    it("should deny access when '*' policy is set to false", function(){

      const req  = {user : {role : 'user'}, options : {controller : 'test'}}
      const res = {forbidden : sinon.spy()}
      const next = sinon.spy()

      permissionsPolicies(req, res, next, s.sails)

      expect(next.called).to.be.false
      expect(res.forbidden.called).to.be.true
    })
  })
})
