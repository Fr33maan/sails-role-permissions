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

    owners : {
      collection : 'user'
    }
  }

}
