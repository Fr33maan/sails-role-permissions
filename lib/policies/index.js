'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _pluralize = require('pluralize');

var _pluralize2 = _interopRequireDefault(_pluralize);

var _controllersPolicy = require('./controllersPolicy');

var _controllersPolicy2 = _interopRequireDefault(_controllersPolicy);

var _actionsPolicy = require('./actionsPolicy');

var _actionsPolicy2 = _interopRequireDefault(_actionsPolicy);

var _parametersPolicy = require('./parametersPolicy');

var _parametersPolicy2 = _interopRequireDefault(_parametersPolicy);

var _reqParamsPolicy = require('./reqParamsPolicy');

var _reqParamsPolicy2 = _interopRequireDefault(_reqParamsPolicy);

var _attributeUtil = require('../util/attributeUtil');

var _resUtil = require('../util/resUtil');

var _resUtil2 = _interopRequireDefault(_resUtil);

var _ownerUtil = require('../util/ownerUtil');

var _ownerUtil2 = _interopRequireDefault(_ownerUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(req, res, next, injectedConfig) {
    var config, controller, action, isBlueprint, msg, filters, alias, forcedAction, isOwner, blueprint, _blueprint, _msg;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            config = sails ? sails.config.permissions : injectedConfig;
            _context.prev = 1;

            // Check if action explicitely exists in controller
            // If not -> it is a blueprint
            controller = req.options.controller;
            action = req.options.action;
            isBlueprint = !(action in sails.controllers[controller]);

            // Remove id, createdAt and updatedAt from each object of req.body if we are using create or update blueprints

            if (isBlueprint && (action === 'create' || action === 'update') && config.removeAutoAttributes === true) {
              req.body = (0, _attributeUtil.removeAutoAttributes)(req.body);
            }

            // Filter req with controller and action policies (Allow / Deny / Pending)

            if (!new _controllersPolicy2.default(req, config).check()) {
              _context.next = 8;
              break;
            }

            return _context.abrupt('return', next());

          case 8:
            if (!new _actionsPolicy2.default(req, config).check()) {
              _context.next = 10;
              break;
            }

            return _context.abrupt('return', next());

          case 10:
            if (isBlueprint) {
              _context.next = 13;
              break;
            }

            msg = "Request is not a blueprint and should already have been filtered, this might be a bug or a bad configuration. Don't set action's policies as object if they aren't blueprints";
            // console.log(msg)

            throw new Error(msg);

          case 13:

            // Can be setted by populate or after
            filters = void 0;

            // Will allow / deny "add" "remove" "populate" blueprint
            // Might also Pending populate if a find/findOne policy exists for child model and then filter the results

            if (!new _parametersPolicy2.default(req, config).check()) {
              _context.next = 24;
              break;
            }

            if (!(action !== 'populate')) {
              _context.next = 17;
              break;
            }

            return _context.abrupt('return', next());

          case 17:

            // check if child model has a find/findOne object policy action
            alias = _pluralize2.default.singular(req.options.alias);

            // Next if find/findOne policy is not an object

            if (!(!config[alias] || !config[alias].find && !config[alias].findOne)) {
              _context.next = 20;
              break;
            }

            return _context.abrupt('return', next());

          case 20:
            if (!((0, _typeof3.default)(config[alias].find) != 'object' && (0, _typeof3.default)(config[alias].findOne) != 'object')) {
              _context.next = 22;
              break;
            }

            return _context.abrupt('return', next());

          case 22:

            // Set forced action find || findOne
            forcedAction = (0, _typeof3.default)(config[alias].find) === 'object' ? 'find' : 'findOne';

            filters = (0, _attributeUtil.attributesFilter)(req, config, null, alias, forcedAction);

          case 24:

            // We are using "find" "findOne" "create" "update"
            filters = !filters ? (0, _attributeUtil.attributesFilter)(req, config) : filters;

            if (sails.config.permissionsTest && sails.config.permissionsTest.filters) {
              console.log(filters);
            }

            // Check ownership and say it req is owner of asked object for 'update' && 'findOne'
            _context.next = 28;
            return (0, _ownerUtil2.default)(req, config.roles);

          case 28:
            isOwner = _context.sent;

            if (!(action === 'create')) {
              _context.next = 34;
              break;
            }

            // Filter body
            req.body = (0, _attributeUtil.filterArrayOrObject)(req.body, filters);
            return _context.abrupt('return', next());

          case 34:
            if (!(action === 'update')) {
              _context.next = 41;
              break;
            }

            if (isOwner) {
              _context.next = 37;
              break;
            }

            throw new Error('req is not owner and tried to update an object');

          case 37:

            // Filter req.body
            req.body = (0, _attributeUtil.filterArrayOrObject)(req.body, filters, isOwner);
            return _context.abrupt('return', next());

          case 41:
            if (!(action === 'find' || action === 'findOne')) {
              _context.next = 47;
              break;
            }

            // Check that req.where && req.sort is not on private attributes
            if (action === 'find') (0, _reqParamsPolicy2.default)(req, filters);

            // Call blueprint if find or findOne
            blueprint = sails.hooks.blueprints.middleware[action.toLowerCase()];

            new Promise(function (resolve, reject) {
              return blueprint(req, (0, _resUtil2.default)(res, resolve, reject));
            }).then(function (models) {
              // Filter result
              return res.ok((0, _attributeUtil.filterArrayOrObject)(models, filters, isOwner));
            }).catch(function (data) {
              // Send error response
              return res[data.method](data.data);
            });

            // This case happen if action is populate and policy is private or if alias has a find/findOne policy which is an object (need filter)
            _context.next = 63;
            break;

          case 47:
            if (!(action === 'populate')) {
              _context.next = 55;
              break;
            }

            if (isOwner) {
              _context.next = 51;
              break;
            }

            if (!(config[controller].populate === 'private' || (0, _typeof3.default)(config[controller].populate) === 'object' && config[controller].populate[req.options.alias] === 'private')) {
              _context.next = 51;
              break;
            }

            throw new Error('req is not owner and tried to ' + action + ' an object');

          case 51:

            // Call blueprint if find or findOne
            _blueprint = sails.hooks.blueprints.middleware[action.toLowerCase()];

            new Promise(function (resolve, reject) {
              return _blueprint(req, (0, _resUtil2.default)(res, resolve, reject));
            }).then(function (models) {
              // Filter result
              return res.ok((0, _attributeUtil.filterArrayOrObject)(models, filters, false));
            }).catch(function (data) {
              // Send error response
              return res[data.method](data.data);
            });

            // This case happen if action is add, remove and policy is private
            // Otherwise, we already have been allowed / denied
            _context.next = 63;
            break;

          case 55:
            if (!(action === 'add' || action === 'remove')) {
              _context.next = 61;
              break;
            }

            if (isOwner) {
              _context.next = 58;
              break;
            }

            throw new Error('req is not owner and tried to ' + action + ' an object');

          case 58:
            return _context.abrupt('return', next());

          case 61:
            _msg = 'request has not been explicitely allowed and this might be a security issue -> Access Denied';
            throw new Error(_msg);

          case 63:
            _context.next = 70;
            break;

          case 65:
            _context.prev = 65;
            _context.t0 = _context['catch'](1);

            if (sails.config.permissionsTest && sails.config.permissionsTest.message) {
              console.log(_context.t0.message);
            }

            if (sails.config.permissionsTest && sails.config.permissionsTest.stack) {
              console.log(_context.t0.stack);
            }

            res.forbidden(_context.t0);

          case 70:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 65]]);
  }));

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();