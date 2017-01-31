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

            if (!(model === 'user' && req.options.action === 'update')) {
              _context.next = 8;
              break;
            }

            _modelId = req.params.id;
            return _context.abrupt('return', _modelId === userId);

          case 8:
            _context.next = 10;
            return sails.models[model].findOne(modelId).populate('owner');

          case 10:
            modelInDb = _context.sent;

            if (modelInDb) {
              _context.next = 13;
              break;
            }

            throw new Error('model not found - id given in parameter is not valid');

          case 13:
            if (!(req.user.role === rolesConfig[0])) {
              _context.next = 15;
              break;
            }

            return _context.abrupt('return', true);

          case 15:
            if (!('owner' in modelInDb)) {
              _context.next = 58;
              break;
            }

            container = modelInDb.owner;

            if (!(container instanceof Array)) {
              _context.next = 52;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 21;
            _iterator = container[Symbol.iterator]();

          case 23:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 36;
              break;
            }

            owner = _step.value;

            if (!(typeof owner === 'string')) {
              _context.next = 30;
              break;
            }

            if (!(owner === userId)) {
              _context.next = 28;
              break;
            }

            return _context.abrupt('return', true);

          case 28:
            _context.next = 33;
            break;

          case 30:
            if (!('id' in owner)) {
              _context.next = 33;
              break;
            }

            if (!(owner.id === userId)) {
              _context.next = 33;
              break;
            }

            return _context.abrupt('return', true);

          case 33:
            _iteratorNormalCompletion = true;
            _context.next = 23;
            break;

          case 36:
            _context.next = 42;
            break;

          case 38:
            _context.prev = 38;
            _context.t0 = _context['catch'](21);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 42:
            _context.prev = 42;
            _context.prev = 43;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 45:
            _context.prev = 45;

            if (!_didIteratorError) {
              _context.next = 48;
              break;
            }

            throw _iteratorError;

          case 48:
            return _context.finish(45);

          case 49:
            return _context.finish(42);

          case 50:
            _context.next = 58;
            break;

          case 52:
            if (!(typeof container === 'string')) {
              _context.next = 56;
              break;
            }

            return _context.abrupt('return', container === userId);

          case 56:
            if (!('id' in container)) {
              _context.next = 58;
              break;
            }

            return _context.abrupt('return', container.id === userId);

          case 58:
            return _context.abrupt('return', false);

          case 59:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[21, 38, 42, 50], [43,, 45, 49]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();