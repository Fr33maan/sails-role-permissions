
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

    expect(() => new actionsPolicy(req, config).check()).to.throw(errorMessages.notFound)
  })

  it("should deny access when '*' policy is set to a role and no controller specific config was found", function(){

    const req  = {options : {controller : 'test', action : 'find'}, user : {role : 'user'}}
    const config = {
      roles,
      all : 'admin',
      test : {}
    }
    const errorMessages = messageUtil.generateActionErrorMessages('test', 'find', 'user', 'admin')

    expect(() => new actionsPolicy(req, config).check()).to.throw(errorMessages.roleIsTooLow)
  })

  it("should deny access when '*' policy is set to a role and no controller specific config was found", function(){

    const req  = {options : {controller : 'test', action : 'find'}}
    const config = {
      roles,
      all : 'admin',
      test : {}
    }
    const errorMessages = messageUtil.generateActionErrorMessages('test', 'find', 'guest', 'admin')

    expect(() => new actionsPolicy(req, config).check()).to.throw(errorMessages.roleIsTooLow)
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

    expect(() => new actionsPolicy(req, config).check()).to.throw(errorMessages.setToFalse)
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

    expect(() => new actionsPolicy(req, config).check()).to.throw(errorMessages.setToFalse)
  })


  it("should deny access when action policy is set to a to guest and reqRole is user", function(){

    const req  = {options : {controller : 'test', action : 'create'}, user : {role : 'user'}}
    const config = {
      roles,
      all : true,
      test : {
        create : 'guest'
      }
    }
    const errorMessages = messageUtil.generateActionErrorMessages('test', 'create', 'user')

    expect(() => new actionsPolicy(req, config).check()).to.throw(errorMessages.setToGuest)
  })

  it("should deny access when action policy is set to a too high role (as guest)", function(){

    const req  = {options : {controller : 'test', action : 'find'}}
    const config = {
      roles,
      all : true,
      test : {
        find : 'admin'
      }
    }
    const errorMessages = messageUtil.generateActionErrorMessages('test', 'find', 'guest', 'admin')
    expect(() => new actionsPolicy(req, config).check()).to.throw(errorMessages.forbiddenForGuests)
  })

  it("should deny access when action policy is set to a too high role (as user)", function(){

    const req  = {options : {controller : 'test', action : 'find'}, user : {role : 'user'}}
    const config = {
      roles,
      all : true,
      test : {
        find : 'admin'
      }
    }
    const errorMessages = messageUtil.generateActionErrorMessages('test', 'find', 'user', 'admin')

    expect(() => new actionsPolicy(req, config).check()).to.throw(errorMessages.roleIsTooLow)
  })

  it("should deny access when action wildcard is set to a to guest (as user)", function(){

    const req  = {options : {controller : 'test', action : 'find'}, user : {role : 'user'}}
    const config = {
      roles,
      all : true,
      test : {
        find : {
          '*' : 'guest'
        }
      }
    }
    const errorMessages = messageUtil.generateActionErrorMessages('test', 'find', 'user', 'guest')
    expect(() => new actionsPolicy(req, config).check()).to.throw(errorMessages.setToGuest)
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

    expect(new actionsPolicy(req, config).check()).to.be.false
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

    expect(new actionsPolicy(req, config).check()).to.be.true
  })

  it("should allow access when wildcard is set to false but action is set to true", function(){

    const req  = {options : {controller : 'test', action : 'find'}}
    const config = {
      all : false,
      test : {
        find : true
      }
    }

    expect(new actionsPolicy(req, config).check()).to.be.true
  })

  it("should allow access when action policy is set to guest and req is guest", function(){

    const req  = {options : {controller : 'test', action : 'test'}}
    const config = {
      all : false,
      test : {
        test : 'guest'
      }
    }

    expect(new actionsPolicy(req, config).check()).to.be.true
  })

  it("should allow access when action policy is set to user and req is user", function(){

    const req  = {options : {controller : 'test', action : 'testFind'}, user : {role : 'user'}}
    const config = {
      roles,
      all : false,
      test : {
        testFind : 'user'
      }
    }

    expect(new actionsPolicy(req, config).check()).to.be.true
  })

  it("should allow access when action policy is set to user and req is user", function(){

    const req  = {options : {controller : 'test', action : 'testFind'}, user : {role : 'admin'}}
    const config = {
      roles,
      all : false,
      test : {
        testFind : 'user'
      }
    }

    expect(new actionsPolicy(req, config).check()).to.be.true
  })

  it("should allow access when global wildcard is set to admin and req is admin", function(){

    const req  = {options : {controller : 'test', action : 'testFind'}, user : {role : 'admin'}}
    const config = {
      roles,
      all : 'admin',
      test : {}
    }

    expect(new actionsPolicy(req, config).check()).to.be.true
  })

  it("should allow access when action wildcard is set to admin and req is admin", function(){

    const req  = {options : {controller : 'test', action : 'find'}, user : {role : 'admin'}}
    const config = {
      roles,
      all : false,
      test : {
        find : {
          '*' : 'admin'
        }
      }
    }

    expect(new actionsPolicy(req, config).check()).to.be.true
  })

  it("should allow access when action wildcard is set to guest and req is admin", function(){

    const req  = {options : {controller : 'test', action : 'find'}, user : {role : 'admin'}}
    const config = {
      roles,
      all : false,
      test : {
        find : {
          '*' : 'guest'
        }
      }
    }

    expect(new actionsPolicy(req, config).check()).to.be.true
  })
})
