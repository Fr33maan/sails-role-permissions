
// External modules
import { Sails }    from 'sails'
import { assert, expect, should }   from 'chai'
import sinon        from 'sinon'

// Utils and config
import SailsServer  from '../util/SailsServer'
import mainConfig   from '../config/mainConfig'

// Internal modules
import permissionsPolicies from '../../src/policies'

let s = new SailsServer()

describe('permissionsPolicies :: denyAll', function(){
  const config = {
    ...mainConfig,
    policies : {'*' : false}
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

  it("should deny access when '*' policy is set to false", function(){

    const req  = {user : {role : 'user'}, options : {controller : 'test'}}
    const res = {forbidden : sinon.spy()}
    const next = sinon.spy()

    permissionsPolicies(req, res, next, s.sails.config.permissions)

    expect(next.called).to.be.false
    expect(res.forbidden.called).to.be.true
  })
})

describe('permissionsPolicies :: allowAll (implicit / default)', function(){
  const config = {
    ...mainConfig
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

  it("should deny access when '*' policy is set to false", function(){

    const req  = {user : {role : 'user'}, options : {controller : 'test'}}
    const res = {forbidden : sinon.spy()}
    const next = sinon.spy()

    permissionsPolicies(req, res, next, s.sails.config.permissions)

    expect(next.called).to.be.true
    expect(res.forbidden.called).to.be.false
  })
})
