# sails-role-permissions (SRP)

Focus on your business logic, stop writing code about users' permissions !

`sails-role-permissions` (SRP) allows you to configure permissionning in the easiest possible way. No code to write, nothing to store in db, no extra controllers/models and nothing to change but **only 1 config file** for your entire app and the magic happens !

SRP allows you to set controller/action/attribute permissions level with very minimalistic configuration.

## Installation

**/!\ WARNING : This module is a security part of your app, a misconfiguration WILL create security issues. READ CAREFULLY the readme.**

`npm install --save sails-role-permissions`

---

## Usage
- You must set up an authentification layer. SRP policies will try to find a `role` attribute in `req.user`. If none is found but if `req.user` exists, it will act that req has role `user`.
- For ownership, your model must have an `owner` attribute which can be a `String` (id) or an `Array` (of ids / objects with id parameter).

---

## FAQ

#### Concepts
- **Why this module ?**
*Blueprints are something wonderful but they are too permissive for a production app, you have to write many `config/policies.js`. The problem is you cannot easily set attribute-level (aka row-level) permissioning in a easy way with policies. SRP does this job for you.*

- **Does my existing policies will work with this hook ?**
*We do not change your existing policies and they will be executed **before** `sails-role-permissions`. If you don't want to use `role-permissions` for a specific action, just configure the action to `true`*

- **Can I use native blueprints with SRP ?**
*Yes, SRP has been made to work with blueprint and avoid writing custom action for duplicating blueprints which needs row-level security.*

- **Can i use srp for all my custom actions ?**
*Yes, SRP works with different level (controller/action/attribute) and you can use 2 first level for your custom actions. Because SRP does not know what your action does, you cannot configure attribute level permission for custom actions.*

- **Does overridden blueprints works with SRP ?**
*Yes, SRP act as a classic policy for most blueprints except find/findOne. For those actions, SRP will directly call them and filter the result instead of passing request to the action by calling next(). In all cases, SRP works with classic blueprints, native and/or overriden.*

- **Does SRP manage authentication for me ?**
*No, SRP does only take care of permissioning for you and let you free to choose how your app should authenticate their users. This make it works with any app*

- **How does SRP reject request ?**
*SRP call res.forbidden(Error). SRP tries to reject consitent error message which clearly indicate what is happening.*

#### Usage
 - **Why my populated models does not contains private attributes even if I am owner of parent model**
*By default and for security reasons, populated models does not allow to display private attributes. I built this module for a chat, imagine that the owner of the sails channel you are chatting in could have access to all users' emails ?*
*You can use the `populatePrivateAttributes` in your nested model configuration to overwrite this.*

- **WARNING with populate**
*Due to granularity needed in permissions, an action can bypass some higher security configuration. Populate is one of them.*
*If you set `populate : true/role` in your config, the result of the action will NOT be filtered. `private` will still deny access to non owner requests.*
---

## Configuration

Configuration is pretty explicit, you always configure `controller` first, then `action` and finaly `attribute`.
`controller` and `action` take 3 types of value : `boolean`, `string` or `object`. Attribute takes `boolean` or `string`.

##### Boolean
Will Allow / Deny requests to this controller / action and will set attribute as forbidden (even for admin).

##### String
Can be a role or a reserved keyword.
`private` is a reserved keyword and will set ownership to an attribute.

##### Object
Contains configuration for a lower permission level.



| Name  | Type  | Default | Description |
|:---         |:---      |:---      |:---  |
| * | `Boolean` or `role` | sails.config.policies['*'] if it is a `Boolean` or `false` | Will be used like wildcard policy, if a controller/action does not have permission set, wildcard will be used. Note that attributes are allowed by default to avoid having to make explicit allowing when wildcard is false |
| roles | `Array` | ['admin', 'user'] | This is the place where you define the roles used by your app. **Don't remove/rename admin role it is needed**. |
| removeAutoAttributes | `Boolean` | `true` | Determine if `id`, `createdAt` and `updatedAt` attributes will be removed from req.body when `post` or `put` so user cannot set them. |

Additionaly to those config attributes, you will set policies by controller :

>*Additional info* :
- There is 2 reserved keywords when you specify a role : **guest** and **private**.
- `guest` can be used to restrict controller/action to NON authenticated users only (signin/signup). It is an automatic role, you don't need to provide it in config.
- `private` is used to declare ownership of an attribute, it will remove it from find request and will be shown in findOne only if req is owner or admin.
- You don't need to provide both find and findOne config, if findOne config is not found, SRP will use find config.
- `update` is a private action by default, it means that only owner or admin can update a model.
- `user` model has special ownership system based on `id` field instead of `owner` filer.

```javascript
module.exports.permissions = {

  // Sometimes you find a bug or you don't understand what happen. Your app does not log messages in console if a forbidden response is sent or you just want to SEE how your config is transformed into filters.
  debug : {
    message : true,
    stack : true,
    filters : true
  },

  '*' : false, // Global wildcard

  channel : true, // controller level policy - everybody can access all actions and all attributes (except creating autoAttributes)

  pet : {
    // By default, private pets attributes won't be in populated models (eg. User.findOne(userId).populate('pets'))
    populatePrivateAttributes : true,

    find : {
      name : true,
      type : 'private'
    }
  },

  user : {
    destroy : 'admin', // action level policy - action available for 'admin' role only

    find : {
      email : 'private' // attribute level policy - only owner/admin role can findOne attribute and only admin can find it
    },

    create : {
        '*' : 'guest', // Action level policy (Action wildcard)
        computedAttribute : false // this attribute is protected and no one even admin can create it with blueprints
    },

    update : {}, //You ABSOLUTELY MUST set a policy to update to activate ownership check,

    populate : {
      pets : true // Will filter pets with pet.find filter
    },

    mycustomaction : true //actions in config MUST be in lowercase due to sails request processing (even if your action in your controller is in camelCase)
  }
}
```

---

## Changelog
#### 0.3.0
- Ramda is not a dep anymore, use only lodash

#### 0.2.0
- filters on populate

#### 0.1.0
- global level permission
- controller level permission
- action level permission
- parameter level permission for add/remove/populate blueprints
- attribute level permission for find/findOne/create/update blueprints
- ownership for attributes

## Todo
- add cache for requests
- use .omit and .select waterline queries to gain performance over filtering after request once 1.x has been released
- refactor tests with await/async instead of promises
- refactor main policy with methods
