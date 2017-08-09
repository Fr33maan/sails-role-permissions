
import permissionPolicies from './policies'
import defaultRoles       from './config/defaultRoles'
import _                  from 'lodash' 

module.exports = function (sails) {
  return {

    configure: function(){
      if(!sails.config.permissions) sails.config.permissions = {}
      if(!sails.config.permissions.roles) sails.config.permissions.roles = defaultRoles
      if(!sails.config.permissions.removeAutoAttributes) sails.config.permissions.removeAutoAttributes = true

      // Remove "guest" role from roles if it has been added by user
      sails.config.permissions.roles = sails.config.permissions.roles.filter(role => role !== 'guest')
    },


    // Initialize the hook
    initialize: function (next) {
      const policies    = sails.config.policies
      const permissions = sails.config.permissions

      // Flavour sails policies with additional permissionsPolicies
      sails.config.policies = _.each(policies, this.addHookPolicies)

      // If no wildcard is set in config.permissions
      const wildcard = permissions['*']
      const wildcardAlias = permissions.all

      // Used in case of policy wildcard is a function instead of a boolean
      // Default is false
      if(wildcard === undefined && wildcardAlias === undefined){
        permissions['*'] = false
        permissions.all  = false

      }else if(wildcard === undefined && wildcardAlias !== undefined){
        permissions['*'] = permissions.all

      }else if(wildcard !== undefined && wildcardAlias === undefined){
        permissions.all = permissions['*']
      }


      // Check that no populate policy is set to true
      this.checkPoliciesValidity(permissions)

      sails.log.verbose('sails-role-permissions hook initialized')
      next()
    },

    checkPoliciesValidity: function(config){
      _.each(config, (cPolicies, controller) => {

        // We don't take any action if controller is not a sails model
        if(!(controller in sails.models)) return

        if(typeof cPolicies === 'object'){
          _.each(cPolicies, (cAction, action) => {

            switch(action){
              case 'populate':
                if(cAction === true) sails.log.warn(`sails-role-permissions hook - Populate policy is set to true, NO FILTER WILL BE APPLIED ON IT => ${controller} - ${action}`)
            }

          })
        }
      })
    },

    // Function to manipulate sails policies and add permissionsPolicies
    addHookPolicies: function(value, key, collection){

      // Store at permissions config level the value of default policy if value is true or false
      if(key === '*' && (typeof value === 'boolean')){
        sails.config.permissions['*'] = value
        sails.config.permissions.all = value // Alias
        collection[key] = [permissionPolicies]
      }

      if(typeof value === 'string'){
        collection[key] = [value, permissionPolicies]

      }else if(value instanceof Array){
        // Rebuild the policy with previous policies plus additional policies
        collection[key] = [
          ...value,
          permissionPolicies
        ]

      }else if(value instanceof Object){
        collection[key] = _.each(value, this.addHookPolicies)
      }
    },
  };
};
