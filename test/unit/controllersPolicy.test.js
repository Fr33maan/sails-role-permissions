
// External modules
import { assert, expect, should }   from 'chai'
import sinon                        from 'sinon'


// Internal modules
import controllersPolicy from '../../src/policies/controllersPolicy'
import roles             from '../../src/config/defaultRoles'


// Internal config
import messageUtil from '../../src/util/messageUtil'



// --------------------------
// ---------- DENY ----------
// --------------------------


describe('controllersPolicy :: Deny', function(){

  // -----------------
  // --- WILDCARD ----
  // -----------------
  describe('wildcard' , function(){
    it("should deny access when '*' policy is set to false and no controller specific config was found", function(){

      const req  = {options : {controller : 'test'}}
      const config = {
        roles,
        all : false
      }
      const errorMessages = messageUtil.generateControllerErrorMessages('test', 'guest')

      expect(() => new controllersPolicy(req, config).check()).to.throw(errorMessages.notFound)
    })

    it("should deny access when '*' policy is set to a too high role and no controller specific config was found", function(){

      const req  = {options : {controller : 'test'}, user : {role : 'user'}}
      const config = {
        roles,
        all : 'admin'
      }
      const errorMessages = messageUtil.generateControllerErrorMessages('test', 'user', 'admin')

      expect(() => new controllersPolicy(req, config).check()).to.throw(errorMessages.roleIsTooLow)
    })

    it("should deny access when '*' policy is set to a too high role and no controller specific config was found", function(){

      const req  = {options : {controller : 'test'}}
      const config = {
        roles,
        all : 'user'
      }
      const errorMessages = messageUtil.generateControllerErrorMessages('test', 'guest', 'user')

      expect(() =>new controllersPolicy(req, config).check()).to.throw(errorMessages.roleIsTooLow)
    })
  })



  it("should deny access when '*' policy is set to true but controller policy is set to false", function(){

    const req  = {options : {controller : 'test'}}
    const config = {
      roles,
      all : true,
      test : false
    }
    const errorMessages = messageUtil.generateControllerErrorMessages('test', 'guest')

    expect(() => new controllersPolicy(req, config).check()).to.throw(errorMessages.setToFalse)
  })


  it("should deny when asking a guest controller and logged as a user (with role)", function(){

    const req  = {options : {controller : 'test'}, user : {role : 'user'}}
    const config = {
      roles,
      all : true,
      test : 'guest'
    }
    const errorMessages = messageUtil.generateControllerErrorMessages('test', 'user')

    expect(() => new controllersPolicy(req, config).check()).to.throw(errorMessages.setToGuest)
  })

  it("should deny when asking a guest controller and logged as a user (without role)", function(){

    const req  = {options : {controller : 'test'}, user : {name : 'libre'}}
    const config = {
      roles,
      all : true,
      test : 'guest'
    }
    const errorMessages = messageUtil.generateControllerErrorMessages('test', 'user')

    expect(() => new controllersPolicy(req, config).check()).to.throw(errorMessages.setToGuest)
  })

  it("should deny when asking a role above req.role", function(){

    const req  = {options : {controller : 'test'}, user : {role : 'user'}}
    const config = {
      roles,
      all : true,
      test : 'admin'
    }
    const errorMessages = messageUtil.generateControllerErrorMessages('test', 'user')

    expect(() => new controllersPolicy(req, config).check()).to.throw(errorMessages.notAllowed)
  })

  it("should deny when asking without role", function(){

    const req  = {options : {controller : 'test'}}
    const config = {
      roles,
      all : true,
      test : 'user'
    }
    const errorMessages = messageUtil.generateControllerErrorMessages('test', 'guest')

    expect(() => new controllersPolicy(req, config).check()).to.throw(errorMessages.forbiddenForGuests)
  })
})


// --------------------------
// -------- PENDING ---------
// --------------------------


describe('controllersPolicy :: Pending', function(){

  it("should skip to next policy (aka return false)", function(){

    const req  = {options : {controller : 'test'}}
    const config = {
      all : false,
      test : {}
    }

    expect(new controllersPolicy(req, config).check()).to.be.false
  })
})


// --------------------------
// --------- ALLOW ----------
// --------------------------


describe('controllersPolicy :: Allow', function(){

  describe('wildcard', function(){
      it("should allow access when wildcard is set to true", function(){

        const req  = {options : {controller : 'test'}}
        const config = {
          all : true,
        }

        expect(new controllersPolicy(req, config).check()).to.be.true
      })

      it("should allow access to req when wildcard is set to admin and controller does not exists", function(){

        const req  = {options : {controller : 'test'}, user : {role : 'admin'}}
        const config = {
          roles,
          all : 'admin'
        }

        expect(new controllersPolicy(req, config).check()).to.be.true
      })
  })

  describe('constroller', function(){
    it("should allow access when controller is set to true", function(){

      const req  = {options : {controller : 'test'}}
      const config = {
        all : false,
        test : true
      }

      expect(new controllersPolicy(req, config).check()).to.be.true
    })

    it("should allow access to guest when controller is set to guest", function(){

      const req  = {options : {controller : 'test'}}
      const config = {
        all : false,
        test : 'guest'
      }

      expect(new controllersPolicy(req, config).check()).to.be.true
    })

    it("should allow access to req when controller is set to lower role", function(){

      const req  = {options : {controller : 'test'}, user : {role : 'admin'}}
      const config = {
        roles,
        all : false,
        test : 'user'
      }

      expect(new controllersPolicy(req, config).check()).to.be.true
    })
  })
})
