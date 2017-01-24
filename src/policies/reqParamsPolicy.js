
import actionUtil from 'sails/lib/hooks/blueprints/actionUtil'
import messageUtil from '../util/messageUtil'


export default function(req, filters){

  const whereCriterias = actionUtil.parseCriteria(req)
  const sortCriteria   = actionUtil.parseSort(req)

  for(let attribute in whereCriterias){
    if(filters.allowed.indexOf(attribute) < 0) throw new Error(messageUtil.criteriaErrorMessages(attribute).where)
  }


  if(!sortCriteria) return true
  const sanitized = sortCriteria.replace(/asc|desc/g, '').trim()
  if(filters.allowed.indexOf(sanitized) < 0) throw new Error(messageUtil.criteriaErrorMessages(sanitized).sort)

  return true
}
