

module.exports = {


  testAction : function(req, res){
    res.ok()
  },

  find : function(req, res){
    res.ok([{name : 'testName'}])
  }


}
