
import permissionPolicies from './policies'


module.exports = function (sails) {
  return {

    configure: function(){
      if(!sails.config.permissions) sails.config.permissions = {}
    },


    // Initialize the hook
    initialize: function (next) {
      const policies = sails.config.policies

      // Flavour sails policies with additional permissionsPolicies
      sails.config.policies = _.each(policies, this.addHookPolicies)

      // Set global permissions policy to false when no global policy has been found neither in config.policies nor config.permissions
      if(!('*' in sails.config.policies) && (!('*' in sails.config.permissions) || !('all' in sails.config.permissions))){
        sails.config.permissions.all = false
        sails.config.permissions['*'] = false
      }

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
