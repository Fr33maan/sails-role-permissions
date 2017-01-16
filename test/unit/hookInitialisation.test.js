
// External modules
import { Sails }    from 'sails'
import sinon        from 'sinon'
import { assert, expect }   from 'chai'
var should = require('chai').should()

// Utils and config
import SailsServer  from '../util/SailsServer'
import roles        from '../config/roles'

// Internal module code
import permissionPolicies from '../../src/policies'


let s = new SailsServer()

const testControllerPolicy = function(req, res, next){next()}
const policies = {
    '*' : true,
    testController : [testControllerPolicy]
}

describe('Basic tests ::', function() {

    const config = {
      policies,
      roles
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


  describe('denyAll tests', function(){

    // Test that Sails can lift with the hook in place
    it ('sails does not crash', function() {
      return true;
    })


    it('should add role-permission policy to all controllers set in sails.config.policies', function(){

      // Check that policies have been changed
      const policies = s.sails.config.policies
      policies['*'].should.not.be.a.boolean
      policies['*'].should.be.a.function
      expect(policies.testController.length).to.equal(2)
      expect(s.sails.config.permissions.all).to.exist
      expect(s.sails.config.permissions.all).to.equal(true)

      // Check that additional policy is sails-hook-role-permission policy
      expect(policies['*'][0].toString()).to.equal(permissionPolicies.toString())
      expect(policies.testController[1].toString()).to.equal(permissionPolicies.toString())

      // Check that previous policies still exist
      expect(policies.testController[0].toString()).to.equal(testControllerPolicy.toString())
    })

  })
})
