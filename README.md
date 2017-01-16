# sails-hook-role-permissions

**/!\ Warning /!\   
This module will edit policies at sails lift, it can cause conflicts if you use another hook that do the same**

## Goal
The purpose of this module is to add a parametrable permission policy to each action in your sails controllers.
The module add the policy after your policies in config/policies.js.
`sails-hookrole-permissions` is compatible with your custom blueprints if you have overrided some.  

## Configuration
```javascript

module.exports.permissions = {

  myModel : {

  }
}

```
---


## Composition
`sails-hook-role-permissions` will add 3 policies on every Controller.action you define in your sails app

#### Models
First it will check if the user can request the model

#### Actions
Then it will check that the requested action is allowed to the role in req.user

#### Parameters
Then it will check if the requested parameters are allowed (populate blueprint)

#### Attributes
Finally it will filter request and/or results depending on action (filter req for update/destroy/create, filter res for find/findOne/populate)


---

## Flow
- modelsPerm
- actionsPerm
- parametersPerm
- attributesPerm
- controllerAction / blueprint call
- attributesPerm

---


## Changelog
####0.1.0
- role based attribute populating in `populate` blueprint


## Todo
- add test for sails integration
- row level permissions
