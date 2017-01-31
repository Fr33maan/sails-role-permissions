module.exports = {


  attributes : {
    name : 'string',
    email : 'string',
    password: 'string',
    nocontroller : {
      collection : 'nocontroller',
    },

    owner : {
      collection : 'user'
    },

    users : {
      collection : 'user',
      via : 'tests'
    }
  }
}
