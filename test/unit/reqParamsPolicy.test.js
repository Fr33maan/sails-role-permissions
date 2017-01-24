
// External modules
import { assert, expect, should }   from 'chai'
import sinon                        from 'sinon'


// Internal modules
import reqParamsPolicy from '../../src/policies/reqParamsPolicy'
import {reqBuilder} from '../util/reqUtil'

// Internal config
import messageUtil from '../../src/util/messageUtil'




// --------------------------
// ---------- DENY ----------
// --------------------------


describe('reqParamsPolicy :: Deny', function(){

  it("should throw error when private attribute is in 'where' clause", function(){

    const req  = reqBuilder('where', 'email', 'testEmail')
    const filters = {
      allowed : ['name'],
      private : ['email']
    }

    const errorMessages = messageUtil.criteriaErrorMessages('email')

    expect(() => reqParamsPolicy(req, filters)).to.throw(errorMessages.where)
  })

  it("should throw error when private attribute is in 'sort asc' clause", function(){

    const req  = reqBuilder('sort asc', 'email', 'testEmail')
    const filters = {
      allowed : ['name'],
      private : ['email']
    }

    const errorMessages = messageUtil.criteriaErrorMessages('email')

    expect(() => reqParamsPolicy(req, filters)).to.throw(errorMessages.sort)
  })

  it("should throw error when private attribute is in 'sort desc' clause", function(){

    const req  = reqBuilder('sort asc', 'email', 'testEmail')
    const filters = {
      allowed : ['name'],
      private : ['email']
    }

    const errorMessages = messageUtil.criteriaErrorMessages('email')

    expect(() => reqParamsPolicy(req, filters)).to.throw(errorMessages.sort)
  })
})


describe('reqParamsPolicy :: Allow', function(){

  it("should return when allowed attribute is in 'where' clause", function(){

    const req  = reqBuilder('where', 'name', 'testName')
    const filters = {
      allowed : ['name'],
      private : ['email']
    }

    reqParamsPolicy(req, filters).should.be.true
  })

  it("should return true when allowed attribute is in 'sort asc' clause", function(){

    const req  = reqBuilder('sort asc', 'name', 'testName')
    const filters = {
      allowed : ['name'],
      private : ['email']
    }

    reqParamsPolicy(req, filters).should.be.true
  })

  it("should return true when allowed attribute is in 'sort desc' clause", function(){

    const req  = reqBuilder('sort desc', 'name', 'testName')
    const filters = {
      allowed : ['name'],
      private : ['email']
    }

    reqParamsPolicy(req, filters).should.be.true
  })

})
