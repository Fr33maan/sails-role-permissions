
// External modules
import { assert, expect, should }   from 'chai'
import sinon                        from 'sinon'


// Internal modules
import actionsPolicy from '../../src/policies/actionsPolicy'
import roles         from '../../src/config/defaultRoles'


// Internal config
import messageUtil from '../../src/util/messageUtil'




// --------------------------
// ---------- DENY ----------
// --------------------------


describe('actionsPolicy :: Deny', function(){

  it("should deny access when '*' policy is set to false and no controller specific config was found", function(){

    const req  = {options : {controller : 'test', action : 'find'}}
    const config = {
      all : false,
      test : {}
    }
    const errorMessages = messageUtil.generateActionErrorMessages('test', 'find', 'guest')

    expect(() => actionsPolicy(req, config)).to.throw(errorMessages.notFound)
  })

  it("should deny access when '*' policy is set to false and no controller specific config was found", function(){

    const req  = {options : {controller : 'test', action : 'find'}}
    const config = {
      all : true,
      test : {
        find : false
      }
    }
    const errorMessages = messageUtil.generateActionErrorMessages('test', 'find', 'guest')

    expect(() => actionsPolicy(req, config)).to.throw(errorMessages.setToFalse)
  })

  it("should deny access when '*' policy is set to false and no controller specific config was found", function(){

    const req  = {options : {controller : 'test', action : 'find'}}
    const config = {
      all : true,
      test : {
        find : false
      }
    }
    const errorMessages = messageUtil.generateActionErrorMessages('test', 'find', 'guest')

    expect(() => actionsPolicy(req, config)).to.throw(errorMessages.setToFalse)
  })
})


// --------------------------
// -------- PENDING ---------
// --------------------------


describe('actionsPolicy :: Pending', function(){

  it("should skip to next policy (aka return false)", function(){

    const req  = {options : {controller : 'test', action : 'find'}}
    const config = {
      all : false,
      test : {
        find : {}
      }
    }

    expect(actionsPolicy(req, config)).to.be.false
  })
})


// --------------------------
// --------- ALLOW ----------
// --------------------------


describe('actionsPolicy :: Allow', function(){

  it("should allow access when wildcard is set to true", function(){

    const req  = {options : {controller : 'test', action : 'find'}}
    const config = {
      all : true,
      test : {}
    }

    expect(actionsPolicy(req, config)).to.be.true
  })

  it("should allow access when wildcard is set to false but action is set to true", function(){

    const req  = {options : {controller : 'test', action : 'find'}}
    const config = {
      all : false,
      test : {
        find : true
      }
    }

    expect(actionsPolicy(req, config)).to.be.true
  })
})
