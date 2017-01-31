'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

if (typeof regeneratorRuntime === 'undefined') require('babel-polyfill');

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, rolesConfig) {
    var model, modelId, userId, _modelId, modelInDb, container, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, owner;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            model = req.options.model;
            modelId = req.params.id;

            if (!(!req.user || !req.user.id)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return', false);

          case 4:
            userId = req.user.id;

            if (!(model === 'user')) {
              _context.next = 14;
              break;
            }

            _modelId = void 0;
            _context.t0 = req.options.action;
            _context.next = _context.t0 === 'add' ? 10 : _context.t0 === 'remove' ? 10 : 12;
            break;

          case 10:
            _modelId = req.params.parentid;
            return _context.abrupt('break', 13);

          case 12:
            _modelId = req.params.id;

          case 13:
            return _context.abrupt('return', _modelId === userId);

          case 14:
            _context.next = 16;
            return sails.models[model].findOne(modelId).populate('owner');

          case 16:
            modelInDb = _context.sent;

            if (modelInDb) {
              _context.next = 19;
              break;
            }

            throw new Error('model not found - id given in parameter is not valid');

          case 19:
            if (!(req.user.role === rolesConfig[0])) {
              _context.next = 21;
              break;
            }

            return _context.abrupt('return', true);

          case 21:
            if (!('owner' in modelInDb)) {
              _context.next = 64;
              break;
            }

            container = modelInDb.owner;

            if (!(container instanceof Array)) {
              _context.next = 58;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 27;
            _iterator = container[Symbol.iterator]();

          case 29:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 42;
              break;
            }

            owner = _step.value;

            if (!(typeof owner === 'string')) {
              _context.next = 36;
              break;
            }

            if (!(owner === userId)) {
              _context.next = 34;
              break;
            }

            return _context.abrupt('return', true);

          case 34:
            _context.next = 39;
            break;

          case 36:
            if (!('id' in owner)) {
              _context.next = 39;
              break;
            }

            if (!(owner.id === userId)) {
              _context.next = 39;
              break;
            }

            return _context.abrupt('return', true);

          case 39:
            _iteratorNormalCompletion = true;
            _context.next = 29;
            break;

          case 42:
            _context.next = 48;
            break;

          case 44:
            _context.prev = 44;
            _context.t1 = _context['catch'](27);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 48:
            _context.prev = 48;
            _context.prev = 49;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 51:
            _context.prev = 51;

            if (!_didIteratorError) {
              _context.next = 54;
              break;
            }

            throw _iteratorError;

          case 54:
            return _context.finish(51);

          case 55:
            return _context.finish(48);

          case 56:
            _context.next = 64;
            break;

          case 58:
            if (!(typeof container === 'string')) {
              _context.next = 62;
              break;
            }

            return _context.abrupt('return', container === userId);

          case 62:
            if (!('id' in container)) {
              _context.next = 64;
              break;
            }

            return _context.abrupt('return', container.id === userId);

          case 64:
            return _context.abrupt('return', false);

          case 65:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[27, 44, 48, 56], [49,, 51, 55]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();