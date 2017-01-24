

export default function(res, resolve, reject){

  return {
    serverError : function(data){
      reject({
        method : 'serverError',
        data
      })
    },

    notFound : function(data){
      reject({
        method : 'notFound',
        data
      })
    },

    ok : function(results){
      resolve(results)
    }
  }

}
