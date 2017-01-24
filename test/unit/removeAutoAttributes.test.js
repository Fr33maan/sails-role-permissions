
// External modules
import { assert, expect, should }   from 'chai'

// Internal modules
import {removeAutoAttributes} from '../../src/util/attributeUtil'


describe('removeAutoAttributes', function(){

  it('should remove autoAttributes from req.body if it is a single object', function(){

    const body = {
      name      : 'test',
      id        : 123,
      createdAt : 123,
      updatedAt : 123
    }

    expect(removeAutoAttributes(body)).to.eql({name : 'test'})

  })

  it('should remove autoAttributes from each object in req.body if it is an array', function(){

    const body = [{
      name      : 'test',
      id        : 123,
      createdAt : 123,
      updatedAt : 123
    }, {
      name      : 'test',
      id        : 123,
      createdAt : 123,
      updatedAt : 123
    }]

    expect(removeAutoAttributes(body)).to.eql([{name : 'test'},{name : 'test'}])

  })


})
