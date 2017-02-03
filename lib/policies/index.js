'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(req, res, next, injectedConfig) {
    var _this = this;

    var config, _ret;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            config = sails ? sails.config.permissions : injectedConfig;
            _context2.prev = 1;
            return _context2.delegateYield(regeneratorRuntime.mark(function _callee() {
              var controller, action, isBlueprint, msg, filters, alias, forcedAction, isOwner, _msg;

              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
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
                        _context.next = 6;
                        break;
                      }

                      return _context.abrupt('return', {
                        v: next()
                      });

                    case 6:
                      if (!new _actionsPolicy2.default(req, config).check()) {
                        _context.next = 8;
                        break;
                      }

                      return _context.abrupt('return', {
                        v: next()
                      });

                    case 8:
                      if (isBlueprint) {
                        _context.next = 11;
                        break;
                      }

                      msg = "Request is not a blueprint and should already have been filtered, this might be a bug or a bad configuration. Don't set action's policies as object if they aren't blueprints";
                      // console.log(msg)

                      throw new Error(msg);

                    case 11:

                      // Can be setted by populate or after
                      filters = void 0;

                      // Will allow / deny "add" "remove" "populate" blueprint
                      // Might also Pending populate if a find/findOne policy exists for child model and then filter the results

                      if (!new _parametersPolicy2.default(req, config).check()) {
                        _context.next = 22;
                        break;
                      }

                      if (!(action !== 'populate')) {
                        _context.next = 15;
                        break;
                      }

                      return _context.abrupt('return', {
                        v: next()
                      });

                    case 15:

                      // check if child model has a find/findOne object policy action
                      alias = _pluralize2.default.singular(req.options.alias);

                      // Next if find/findOne policy is not an object

                      if (!(!config[alias] || !config[alias].find && !config[alias].findOne)) {
                        _context.next = 18;
                        break;
                      }

                      return _context.abrupt('return', {
                        v: next()
                      });

                    case 18:
                      if (!(_typeof(config[alias].find) != 'object' && _typeof(config[alias].findOne) != 'object')) {
                        _context.next = 20;
                        break;
                      }

                      return _context.abrupt('return', {
                        v: next()
                      });

                    case 20:

                      // Set forced action find || findOne
                      forcedAction = _typeof(config[alias].find) === 'object' ? 'find' : 'findOne';

                      filters = (0, _attributeUtil.attributesFilter)(req, config, null, alias, forcedAction);

                    case 22:

                      // We are using "find" "findOne" "create" "update"
                      filters = !filters ? (0, _attributeUtil.attributesFilter)(req, config) : filters;

                      // Check ownership and say it req is owner of asked object for 'update' && 'findOne'
                      _context.next = 25;
                      return (0, _ownerUtil2.default)(req, config.roles);

                    case 25:
                      isOwner = _context.sent;

                      if (!(action === 'create')) {
                        _context.next = 31;
                        break;
                      }

                      // Filter body
                      req.body = (0, _attributeUtil.filterArrayOrObject)(req.body, filters);
                      return _context.abrupt('return', {
                        v: next()
                      });

                    case 31:
                      if (!(action === 'update')) {
                        _context.next = 38;
                        break;
                      }

                      if (isOwner) {
                        _context.next = 34;
                        break;
                      }

                      throw new Error('req is not owner and tried to update an object');

                    case 34:

                      // Filter req.body
                      req.body = (0, _attributeUtil.filterArrayOrObject)(req.body, filters, isOwner);
                      return _context.abrupt('return', {
                        v: next()
                      });

                    case 38:
                      if (!(action === 'find' || action === 'findOne')) {
                        _context.next = 42;
                        break;
                      }

                      (function () {
                        // Check that req.where && req.sort is not on private attributes
                        if (action === 'find') (0, _reqParamsPolicy2.default)(req, filters);

                        // Call blueprint if find or findOne
                        var blueprint = sails.hooks.blueprints.middleware[action.toLowerCase()];
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
                      })();

                      _context.next = 54;
                      break;

                    case 42:
                      if (!(action === 'populate')) {
                        _context.next = 46;
                        break;
                      }

                      (function () {
                        // Check ownership
                        if (!isOwner) {
                          if (config[controller].populate === 'private' || _typeof(config[controller].populate) === 'object' && config[controller].populate[req.options.alias] === 'private') {
                            throw new Error('req is not owner and tried to ' + action + ' an object');
                          }
                        }

                        // Call blueprint if find or findOne
                        var blueprint = sails.hooks.blueprints.middleware[action.toLowerCase()];
                        new Promise(function (resolve, reject) {
                          return blueprint(req, (0, _resUtil2.default)(res, resolve, reject));
                        }).then(function (models) {
                          // Filter result
                          return res.ok((0, _attributeUtil.filterArrayOrObject)(models, filters, isOwner));
                        }).catch(function (data) {
                          // Send error response
                          return res[data.method](data.data);
                        });

                        // This case happen if action is add, remove and policy is private
                        // Otherwise, we already have been allowed / denied
                      })();

                      _context.next = 54;
                      break;

                    case 46:
                      if (!(action === 'add' || action === 'remove')) {
                        _context.next = 52;
                        break;
                      }

                      if (isOwner) {
                        _context.next = 49;
                        break;
                      }

                      throw new Error('req is not owner and tried to ' + action + ' an object');

                    case 49:
                      return _context.abrupt('return', {
                        v: next()
                      });

                    case 52:
                      _msg = 'request has not been explicitely allowed and this might be a security issue -> Access Denied';
                      throw new Error(_msg);

                    case 54:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, _callee, _this);
            })(), 't0', 3);

          case 3:
            _ret = _context2.t0;

            if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt('return', _ret.v);

          case 6:
            _context2.next = 12;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t1 = _context2['catch'](1);

            if (sails.config.permissionsTest) {
              console.log(_context2.t1.message);
              // console.log(e.stack)
            }

            res.forbidden(_context2.t1);

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 8]]);
  }));

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();