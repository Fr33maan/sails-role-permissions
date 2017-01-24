
// External modules
import { assert, expect, should }   from 'chai'

// Internal modules
import {filterArrayOrObject} from '../../src/util/attributeUtil'


describe('filterArrayOrObject', function(){

  it('should only keep allowed attributes in req.body if it is a single object', function(){

    const filters = {
      allowed : ['name', 'email', 'password'],
      private : []
    }

    const body = {
      name           : 'test',
      email          : 'email',
      adminAttribute : 123
    }

    expect(filterArrayOrObject(body, filters)).to.eql({
      name           : 'test',
      email          : 'email'
    })

  })


  it('should only keep allowed attributes in req.body if it is an array', function(){

    const filters = {
      allowed : ['name', 'email', 'password'],
      private : []
    }

    const body = [{
      name           : 'test',
      email          : 'email',
      adminAttribute : 123
    },{
      name           : 'test',
      email          : 'email',
      adminAttribute : 123
    }]

    expect(filterArrayOrObject(body, filters)).to.eql([
      {
        name  : 'test',
        email : 'email'
      },{
        name  : 'test',
        email : 'email'
      }
    ])

  })
})
