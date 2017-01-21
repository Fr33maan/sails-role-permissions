

module.exports = {


  testAction : function(req, res){
    res.ok()
  },


  testActionWithParam : function(req, res){
    res.ok({...req.params})
  },

  find : function(req, res){
    res.ok([{name : 'testName'}])
  }


}
