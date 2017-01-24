

export function reqBuilder(reqType, attribute, value){

  return {

    options : {},
    params : {
      all : function(){

        return {
          where : reqType === 'where' ? {[attribute] : value} : undefined
        }
      }
    },
    allParams : function(){
      return reqType === 'where' ? {[attribute] : value} : undefined
    },
    param : function(type){

      if(reqType === 'sort asc'){
        return attribute + ' asc'
      }else if(reqType === 'sort desc'){
        return attribute + ' desc'
      }

      return undefined
    }
  }
}
