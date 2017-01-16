
// External modules
import { Sails }    from 'sails'
import sinon        from 'sinon'

// Utils and config
import SailsServer  from '../util/SailsServer'
import policies     from '../config/denyAllPolicies'
import roles        from '../config/roles'



let s = new SailsServer()


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

    it('should add role-permission policy to all controllers set in sails.config.policies', function(){

      const req  = {user : {role : 'user'}}
      const next = sinon.spy()



      return true
    })

  })
})
