module.exports = {


  attributes : {
    name : 'string',
    type : 'string',
    users : {
      collection : 'user',
      via : 'pets'
    }
  }
}
