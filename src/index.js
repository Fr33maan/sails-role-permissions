
import permissionPolicies from './policies'
import defaultRoles       from './config/defaultRoles'

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
      const policies = sails.config.policies

      // Flavour sails policies with additional permissionsPolicies
      sails.config.policies = _.each(policies, this.addHookPolicies)

      next()
    },


    // Function to manipulate sails policies and add permissionsPolicies
    addHookPolicies: function(value, key, collection){

      // Store at permissions config level the value of default policy if value is true or false
      if(key === '*' && typeof value === 'boolean'){
        sails.config.permissions['*'] = value
        sails.config.permissions.all = value // Alias
      }

      // Rebuild the policy with previous policies plus additional policies
      collection[key] = [
        ...value,
        permissionPolicies
      ]
    },
  };
};
