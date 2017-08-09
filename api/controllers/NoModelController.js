

module.exports = {


  testAction : function(req, res){
    res.ok()
  },

  allowAccess: function(req, res){
    res.ok('access allowed')
  },

  denyAccess: function(req, res){
    res.ok('access denied')
  }
}
