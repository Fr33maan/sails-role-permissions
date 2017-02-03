'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

if (typeof regeneratorRuntime === 'undefined') require('babel-polyfill');

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, rolesConfig) {
    var model, modelId, userId, modelInDb, container, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, owner;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            model = req.options.model;
            modelId = void 0;

            if (!(!req.user || !req.user.id)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt('return', false);

          case 4:
            userId = req.user.id;
            _context.t0 = req.options.action;
            _context.next = _context.t0 === 'add' ? 8 : _context.t0 === 'remove' ? 8 : _context.t0 === 'populate' ? 8 : 10;
            break;

          case 8:
            modelId = req.params.parentid;
            return _context.abrupt('break', 11);

          case 10:
            modelId = req.params.id;

          case 11:
            if (!(model === 'user')) {
              _context.next = 13;
              break;
            }

            return _context.abrupt('return', modelId === userId);

          case 13:
            _context.next = 15;
            return sails.models[model].findOne(modelId).populate('owner');

          case 15:
            modelInDb = _context.sent;

            if (modelInDb) {
              _context.next = 18;
              break;
            }

            throw new Error('model not found - id given in parameter is not valid');

          case 18:
            if (!(req.user.role === rolesConfig[0])) {
              _context.next = 20;
              break;
            }

            return _context.abrupt('return', true);

          case 20:
            if (!('owner' in modelInDb)) {
              _context.next = 63;
              break;
            }

            container = modelInDb.owner;

            if (!(container instanceof Array)) {
              _context.next = 57;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 26;
            _iterator = container[Symbol.iterator]();

          case 28:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 41;
              break;
            }

            owner = _step.value;

            if (!(typeof owner === 'string')) {
              _context.next = 35;
              break;
            }

            if (!(owner === userId)) {
              _context.next = 33;
              break;
            }

            return _context.abrupt('return', true);

          case 33:
            _context.next = 38;
            break;

          case 35:
            if (!('id' in owner)) {
              _context.next = 38;
              break;
            }

            if (!(owner.id === userId)) {
              _context.next = 38;
              break;
            }

            return _context.abrupt('return', true);

          case 38:
            _iteratorNormalCompletion = true;
            _context.next = 28;
            break;

          case 41:
            _context.next = 47;
            break;

          case 43:
            _context.prev = 43;
            _context.t1 = _context['catch'](26);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 47:
            _context.prev = 47;
            _context.prev = 48;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 50:
            _context.prev = 50;

            if (!_didIteratorError) {
              _context.next = 53;
              break;
            }

            throw _iteratorError;

          case 53:
            return _context.finish(50);

          case 54:
            return _context.finish(47);

          case 55:
            _context.next = 63;
            break;

          case 57:
            if (!(typeof container === 'string')) {
              _context.next = 61;
              break;
            }

            return _context.abrupt('return', container === userId);

          case 61:
            if (!('id' in container)) {
              _context.next = 63;
              break;
            }

            return _context.abrupt('return', container.id === userId);

          case 63:
            return _context.abrupt('return', false);

          case 64:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[26, 43, 47, 55], [48,, 50, 54]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();