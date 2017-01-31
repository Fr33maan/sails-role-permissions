module.exports = {


  attributes : {
    name : 'string',
    favoritePet : 'string',

    tests : {
      collection: 'test',
      via : 'users'
    },

    pets : {
      collection: 'pet',
      via : 'users'
    }

  }

}
