# sails-hook-role-permissions

**/!\ Warning /!\   
This module will edit policies at sails lift, it can cause conflicts if you use another hook that do the same**

## Goal
The purpose of this module is to add a parametrable permission policy to each action in your sails controllers.
The module add the policy after your policies in config/policies.js.
`sails-hook-role-permissions` is compatible with your custom blueprints if you have overrided some.  

## Configuration

`sails-hook-role-permissions` will use your policies global '\*' setting as a global setting. It means that if you allow all ControllerActions in sails.config.policies, the hook will do the same.  
The hook will prevail over your own policies. It means that if you don't configure it to allow asked routes, they will use your sails.config.policies['\*'] setting (aka reject everything if you set it to false, even if your previous policies was allowing the request).  
You can also configure a global policy directly in `sails.config.permissions` exactly the same way as you do in `sails.config.policies`.  
By default, `sails.js` set the global parameter to true, it means that if you forget to set it in both `sails.config.policies` and `sails.config.permissions`, your app will allow every route.  


By default `sails-hook-role-permissions` will deny creation of autoset attributes (createdAt, updatedAt, id) so you don't need to specify it in your config file.  
If you set a parameter to `guest` it means that only a guest (user without role) can use this attribute. If you want the attribute to be available from rank `guest`, set it to true.  
`sails-hook-role-permissions` use **controllers** and not **models** for configuration. It means that you can have a controller without a model associated to it and configure role-permissions for it.  


When `sails-hook-role-permissions` reject a request it does it with res.forbidden by passing it an Error with a reason so you can use your customs responses.  
The hook try to throw explicit error message so you can quickly understand what is happening with it.  


```javascript

module.exports.permissions = {

  '*' : false,

  channel : true, // model level policy - everybody can access all actions and all attributes (expect creating autoset attributes)

  user : {
    destroy : 'admin', // action level policy - action available from 'admin' role

    find : {
      '*' : true,
      email : 'admin' // attribute level policy - only 'admin' role can find email attribute
    },

    create : {
        '*' : 'guest', // Only guest can create a user
        computedAttribute : false // this attribute is protected
    }
  }
}

// Guest (not a user) is a reserved keyword and is implicitely set up, you don't need to specify it
// Sort highest roles from the top to the bottom
sails.config.permissions.roles = [
  'admin',
  'moderator',
  'follower',
  'user'
]

```
---


## Composition
`sails-hook-role-permissions` will add 4 policies on every Controller.action you define in your sails app

#### Controllers
`sails-hook-role-permissions` make controls by controller name.  
First it will check if the user can request the controller.

#### Actions
Then it will check that the requested action is allowed to the role in req.user

#### Parameters
Then it will check if the requested parameters are allowed (populate blueprint)

#### Attributes
Finally it will filter request and/or results depending on action (filter req for update/destroy/create, filter res for find/findOne/populate)


---

## Flow
- controllersPolicy
- actionsPolicy
- parametersPerm
- attributesPerm
- controllerAction / blueprint call
- attributesPerm

---


## Changelog
####0.1.0
- global level permission
- controller level permission


## Todo
- add cache for requests
- attribute level permissions
- make role field custumizable
