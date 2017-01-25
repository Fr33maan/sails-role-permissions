
// External modules
import { assert, expect, should }   from 'chai'
import sinon                        from 'sinon'


// Internal modules
import {attributesFilter} from '../../src/util/attributeUtil'
import roles            from '../../src/config/defaultRoles'


// Internal config
import messageUtil from '../../src/util/messageUtil'

const mainModelDefinition = {
  name: { type: 'string' },
  email: { type: 'string' },
  password: { type: 'string' },
  id: {
    type: 'integer',
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  createdAt: { type: 'datetime' },
  updatedAt: { type: 'datetime' }
}

describe('attributesFilter', function(){


  // -----------------
  // ----- FIND ------
  // -----------------

  describe('find', function(){
    it('should build filter for user', function(){

      const req  = {options : {controller : 'test', action : 'find'}, user : {role : 'user'}, params : []}
      const config = {
        roles,
        all : false,
        test : {
          find : {
            password : false,
            email : 'private',
            updatedAt : 'private'
          }
        }
      }

      const filters = attributesFilter(req, config, mainModelDefinition)

      filters.should.eql({
        allowed : ['name', 'id', 'createdAt'],
        private : ['email', 'updatedAt'],
      })
    })

    it('should build filter for admin', function(){

      const req  = {options : {controller : 'test', action : 'find'}, user : {role : 'admin'}, params : []}
      const config = {
        roles,
        all : false,
        test : {
          find : {
            password : false,
            email : 'private',
            updatedAt : 'private'
          }
        }
      }

      const filters = attributesFilter(req, config, mainModelDefinition)

      filters.should.eql({
        allowed : ['name', 'email', 'id', 'createdAt', 'updatedAt'],
        private : [],
      })
    })

    it('should build filter for findOne action and take find config', function(){

      const req  = {options : {controller : 'test', action : 'findOne'}, user : {role : 'admin'}, params : []}
      const config = {
        roles,
        all : false,
        test : {
          find : {
            password : false,
            email : 'private',
            updatedAt : 'private'
          }
        }
      }

      const filters = attributesFilter(req, config, mainModelDefinition)

      filters.should.eql({
        allowed : ['name', 'email', 'id', 'createdAt', 'updatedAt'],
        private : [],
      })
    })


    it('should build filter for user (with ranked attributes)', function(){

      const req  = {options : {controller : 'test', action : 'find'}, params : [], user : {role : 'user'}}
      const modelDefinition = {
        ...mainModelDefinition,
        gender : {type : 'string'}
      }
      const config = {
        roles,
        all : false,
        test : {
          find : {
            password : 'admin',
            gender : 'user',
            email : 'private',
            updatedAt : 'private'
          }
        }
      }

      const filters = attributesFilter(req, config, modelDefinition)

      filters.should.eql({
        allowed : ['name', 'id', 'createdAt', 'gender'],
        private : ['email', 'updatedAt']
      })
    })

    it('should build filter for user (with ranked attributes)', function(){

      const req  = {options : {controller : 'test', action : 'find'}, params : [], user : {role : 'admin'}}
      const modelDefinition = {
        ...mainModelDefinition,
        gender : {type : 'string'}
      }
      const config = {
        roles,
        all : false,
        test : {
          find : {
            password : 'admin',
            gender : 'user',
            email : 'private',
            updatedAt : 'private'
          }
        }
      }

      const filters = attributesFilter(req, config, modelDefinition)

      filters.should.eql({
        allowed : ['name', 'email', 'password', 'id', 'createdAt', 'updatedAt', 'gender'],
        private : []
      })
    })

  })




  // -----------------
  // ---- CREATE -----
  // -----------------

  describe('create', function(){
  })
})
