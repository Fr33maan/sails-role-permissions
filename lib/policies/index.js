'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, res, next, injectedConfig) {

  function filterReqBody(filter) {
    req.body = _ramda2.default.omit(filter, req.body);
  }

  function filterResult(filter) {
    // req.body = R.props(filter, req.body)
  }

  var config = sails ? sails.config.permissions : injectedConfig;

  try {
    // Check if action explicitely exists in controller
    // If not -> it is a blueprint
    var controller = req.options.controller;
    var action = req.options.action;
    var isBlueprint = !(action in sails.controllers[controller]);

    // Remove id, createdAt and updatedAt from each object of req.body if we are using create or update blueprints
    if (isBlueprint && (action === 'create' || action === 'update') && config.removeAutoAttributes) {
      req.body = (0, _attributeUtil.removeAutoAttributes)(req.body);
    }

    // Filter req with controller and action policies (Allow / Deny / Pending)
    if (new _controllersPolicy2.default(req, config).check()) return next(); //Bypass other policies if policy returns true
    if (new _actionsPolicy2.default(req, config).check()) return next();

    // Destroy blueprint should already have been allowed / denied
    // Attributes permissioning is only available for blueprints
    if (!isBlueprint) {
      var _msg = "Request is not a blueprint and should already have been filtered, this might be a bug or a bad configuration. Don't set action policies as object if they aren't blueprints";
      // console.log(msg)
      throw new Error(_msg);
    }

    // Will allow / deny "add" "remove" "populate" blueprint
    if (new _parametersPolicy2.default(req, config).check()) return next();

    // We are using "find" "findOne" "create" "update"
    var filters = (0, _attributeUtil.attributesFilter)(req, config);

    if (action === 'create') {
      // Filter body
      req.body = (0, _attributeUtil.filterArrayOrObject)(req.body, filters);
      return next();
    } else if (action === 'update') {
      // OwnershipPolicy
      // Filter req.body
      return next();
    } else if (action === 'find' || action === 'findone') {
      // Check that req.where && req.sort is not on private attributes
      if (action === 'find') (0, _reqParamsPolicy2.default)(req, filters);

      // Execute action
      // Filter result
    }

    var msg = 'request has not been explicitely allowed and this might be a security issue -> Access Denied';
    // console.log(msg)
    throw new Error(msg);
    next();
  } catch (e) {
    console.log(e.message);
    res.forbidden(e);
  }
};

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _controllersPolicy = require('./controllersPolicy');

var _controllersPolicy2 = _interopRequireDefault(_controllersPolicy);

var _actionsPolicy = require('./actionsPolicy');

var _actionsPolicy2 = _interopRequireDefault(_actionsPolicy);

var _parametersPolicy = require('./parametersPolicy');

var _parametersPolicy2 = _interopRequireDefault(_parametersPolicy);

var _reqParamsPolicy = require('./reqParamsPolicy');

var _reqParamsPolicy2 = _interopRequireDefault(_reqParamsPolicy);

var _attributeUtil = require('../util/attributeUtil');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }