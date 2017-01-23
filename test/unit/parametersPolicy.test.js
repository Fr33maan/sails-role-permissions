
// External modules
import { assert, expect, should }   from 'chai'
import sinon                        from 'sinon'


// Internal modules
import parametersPolicy  from '../../src/policies/parametersPolicy'
import roles             from '../../src/config/defaultRoles'


// Internal config
import messageUtil from '../../src/util/messageUtil'


// --------------------------
// ---------- DENY ----------
// --------------------------

describe('parametersPolicy ::: Deny', function(){

  describe('Wildcard', function(){
    it('should deny populate when wildcard is false and there is no policy for attribute', function(){

      const req  = {
        user : {name : 'l1br3'}, // auto assign 'user' role
        options : {
          controller : 'test',
          action : 'populate',
          alias : 'nestedAttr'
        },
      }
      const config = {
        all : false,
        test : {
          populate : {}
        }
      }
      const errorMessages = messageUtil.generateAttributeErrorMessages('test', 'populate', 'nestedAttr', 'user', false)

      expect(() => new parametersPolicy(req, config).check()).to.throw(errorMessages.notFound)
    })

    it("should deny when wildcard is set to role and user has incorrect role if attribute is not set in config", function(){

      const req  = {options : {controller : 'test', action : 'populate', alias : 'nestedAttr'}, user : {name : 'l1br3'}}
      const config = {
        roles,
        all : 'admin',
        test : {
          populate : {}
        }
      }
      const errorMessages = messageUtil.generateAttributeErrorMessages('test', 'populate', 'nestedAttr', 'user', 'admin')

      expect(() => new parametersPolicy(req, config).check()).to.throw(errorMessages.roleIsTooLow)
    })
  })


  it('should deny populate when wildcard is true and policy is false', function(){

    const req  = {
      user : {name : 'l1br3'}, // auto assign 'user' role
      options : {
        controller : 'test',
        action : 'populate',
        alias : 'nestedAttr'
      },
    }
    const config = {
      all : true,
      test : {
        populate : {
          nestedAttr : false
        }
      }
    }
    const errorMessages = messageUtil.generateAttributeErrorMessages('test', 'populate', 'nestedAttr', 'user', false)

    expect(() => new parametersPolicy(req, config).check()).to.throw(errorMessages.setToFalse)
  })


  it('should deny populate when attribute is set to guest and req is not guest', function(){

    const req  = {
      user : {name : 'l1br3'}, // auto assign 'user' role
      options : {
        controller : 'test',
        action : 'populate',
        alias : 'nestedAttr'
      },
    }
    const config = {
      all : true,
      test : {
        populate : {
          nestedAttr : 'guest'
        }
      }
    }
    const errorMessages = messageUtil.generateAttributeErrorMessages('test', 'populate', 'nestedAttr', 'user', 'guest')

    expect(() => new parametersPolicy(req, config).check()).to.throw(errorMessages.setToGuest)
  })
})


// --------------------------
// -------- PENDING ---------
// --------------------------

describe('parametersPolicy :: Pending', function(){

  it("should skip to next policy (aka return false) if action is 'find'", function(){
    const req  = {options : {controller : 'test', action :'find'}}
    const config = {
      all : true,
      test : {
        find : {}
      }
    }
    expect(new parametersPolicy(req, config).check()).to.be.false
  })

  it("should skip to next policy (aka return false) if action is 'create'", function(){
    const req  = {options : {controller : 'test', action :'create'}}
    const config = {
      all : true,
      test : {
        create : {}
      }
    }
    expect(new parametersPolicy(req, config).check()).to.be.false
  })

  it("should skip to next policy (aka return false) if action is 'update'", function(){
    const req  = {options : {controller : 'test', action :'update'}}
    const config = {
      all : true,
      test : {
        update : {}
      }
    }
    expect(new parametersPolicy(req, config).check()).to.be.false
  })
})



// --------------------------
// --------- ALLOW ----------
// --------------------------


describe('parametersPolicy :: Allow', function(){

  it("should allow access when wildcard is set to true", function(){

    const req  = {options : {controller : 'test', action : 'populate', alias : 'nested'}}
    const config = {
      all : true,
      test : {
        populate : {}
      }
    }

    expect(new parametersPolicy(req, config).check()).to.be.true
  })

  it("should allow access when attribute is set to true", function(){

    const req  = {options : {controller : 'test', action : 'populate', alias : 'nestedAttr'}}
    const config = {
      all : false,
      test : {
        populate : {
          nestedAttr : true
        }
      }
    }

    expect(new parametersPolicy(req, config).check()).to.be.true
  })

  it("should allow access when wildcard is set to role and user has correct role if attribute is not set in config", function(){

    const req  = {options : {controller : 'test', action : 'populate', alias : 'nestedAttr'}, user : {name : 'l1br3'}}
    const config = {
      roles,
      all : 'user',
      test : {
        populate : {}
      }
    }

    expect(new parametersPolicy(req, config).check()).to.be.true
  })

  it("should allow access when attribute is set to guest and req is guest", function(){

    const req  = {options : {controller : 'test', action : 'populate', alias : 'nestedAttr'}}
    const config = {
      roles,
      all : 'user',
      test : {
        populate : {
          nestedAttr : 'guest'
        }
      }
    }

    expect(new parametersPolicy(req, config).check()).to.be.true
  })

})
