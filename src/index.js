
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
      next()
    },


    // Function to manipulate sails policies and add permissionsPolicies
    addHookPolicies: function(value, key, collection){

      // Store at permissions config level the value of default policy if value is true or false
      if(key === '*' && typeof value === 'boolean'){
        sails.config.permissions.all = value
      }

      collection[key] = [
        ...value,
        permissionPolicies
      ]
    },
  };
};
