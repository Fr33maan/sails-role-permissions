
// External modules
import { assert, expect, should }   from 'chai'
import sinon                        from 'sinon'


// Internal modules
import actionsPolicy from '../../src/policies/actionsPolicy'
import roles         from '../../src/config/defaultRoles'


// Internal config
import * as errorMessages from '../../src/config/errorMessages'



// --------------------------
// ---------- DENY ----------
// --------------------------


describe('actionsPolicy :: Deny', function(){

  it("should deny access when '*' policy is set to false and no controller specific config was found", function(){

    const req  = {options : {controller : 'test'}}
    const config = {
      all : false
    }

    // expect(() => controllersPolicy(req, config)).to.throw(errorMessages.controllerNotFound)
  })
})


// --------------------------
// -------- PENDING ---------
// --------------------------


describe('actionsPolicy :: Pending', function(){

  it("should skip to next policy (aka return false)", function(){

    const req  = {options : {controller : 'test'}}
    const config = {
      all : false,
      test : {}
    }

    // expect(controllersPolicy(req, config)).to.be.false
  })
})


// --------------------------
// --------- ALLOW ----------
// --------------------------


describe('actionsPolicy :: Allow', function(){

  it("should allow access when wildcard is set to true", function(){

    const req  = {options : {controller : 'test'}}
    const config = {
      all : true,
    }

    // expect(controllersPolicy(req, config)).to.be.true
  })
})
