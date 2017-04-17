'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.attributesFilter = attributesFilter;
exports.removeAutoAttributes = removeAutoAttributes;
exports.filterArrayOrObject = filterArrayOrObject;

var _RoleUtil = require('../util/RoleUtil');

var _RoleUtil2 = _interopRequireDefault(_RoleUtil);

var _messageUtil = require('../util/messageUtil');

var _messageUtil2 = _interopRequireDefault(_messageUtil);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function attributesFilter(req, config, modelDefinition, forceModel, forceAction) {

  var modelName = forceModel || req.options.controller;

  // Assume that we are in sails environment because we manually inject modelDefinition for testing
  if (!modelDefinition) {
    if (!(modelName in sails.models)) throw new Error('Model (' + modelName + ') not found in sails');

    modelDefinition = sails.models[modelName].definition;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = sails.models[modelName].associations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var association = _step.value;

        modelDefinition[association.alias] = 'association';
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  var controller = forceModel || req.options.controller;
  var action = forceAction || req.options.action;
  var container = config[controller][action];

  // Take find config if findOne config does not exists
  if (action === 'findOne' && !container) container = config[controller].find;

  var reqRole = req.user ? req.user.role || 'user' : 'guest';

  var filters = {
    allowed: [
      // Visible attributes for this user
    ],
    private: [
      // Conditional attributes for this user
    ]
  };

  for (var attribute in modelDefinition) {

    if ((typeof container === 'undefined' ? 'undefined' : (0, _typeof3.default)(container)) === 'object' && attribute in container) {

      var policy = container[attribute];
      var visibility = void 0;

      if (policy === 'private') {
        if (reqRole === 'admin') {
          filters.allowed.push(attribute);
        } else {
          filters.private.push(attribute);
        }
      } else if (typeof policy === 'string') {

        var RoleUtilInstance = new _RoleUtil2.default(reqRole, config);

        // Check that role exists
        if (!RoleUtilInstance.roleExists(policy)) throw new Error('role ' + policy + ' does not exists');

        // If reqRole is allowed, set attribute as allowed
        if (RoleUtilInstance.isRoleAllowed(policy)) filters.allowed.push(attribute);
      } else if (typeof policy === 'boolean') {
        if (policy) filters.allowed.push(attribute);
      }
    } else {
      filters.allowed.push(attribute);
    }
  }

  return filters;
}

function removeAutoAttributes(arrayOrObject) {

  if (arrayOrObject instanceof Array) {
    return arrayOrObject.map(function (object) {
      return _lodash2.default.omit(object, ['id', 'createdAt', 'updatedAt']);
    });
  } else {
    return _lodash2.default.omit(arrayOrObject, ['id', 'createdAt', 'updatedAt']);
  }
}

function filterArrayOrObject(arrayOrObject, filters, isOwner) {

  function buildNewBody(body) {
    var newBody = {};
    for (var key in body) {
      if (filters.allowed.indexOf(key) > -1) newBody[key] = body[key];
      if (isOwner && filters.private.indexOf(key) > -1) newBody[key] = body[key];
    }
    return newBody;
  }

  if (arrayOrObject instanceof Array) {
    return arrayOrObject.map(buildNewBody);
  } else {
    return buildNewBody(arrayOrObject);
  }
}