'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, rolesConfig) {
    var model, modelId, userId, modelInDb, container, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, owner;

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
            _context.next = 7;
            return sails.models[model].findOne(modelId).populate('owner');

          case 7:
            modelInDb = _context.sent;

            if (modelInDb) {
              _context.next = 10;
              break;
            }

            throw new Error('model not found - id given in parameter is not valid');

          case 10:
            if (!(req.user.role === rolesConfig[0])) {
              _context.next = 12;
              break;
            }

            return _context.abrupt('return', true);

          case 12:
            if (!('owner' in modelInDb)) {
              _context.next = 55;
              break;
            }

            container = modelInDb.owner;

            if (!(container instanceof Array)) {
              _context.next = 49;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 18;
            _iterator = container[Symbol.iterator]();

          case 20:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 33;
              break;
            }

            owner = _step.value;

            if (!(typeof owner === 'string')) {
              _context.next = 27;
              break;
            }

            if (!(owner === userId)) {
              _context.next = 25;
              break;
            }

            return _context.abrupt('return', true);

          case 25:
            _context.next = 30;
            break;

          case 27:
            if (!('id' in owner)) {
              _context.next = 30;
              break;
            }

            if (!(owner.id === userId)) {
              _context.next = 30;
              break;
            }

            return _context.abrupt('return', true);

          case 30:
            _iteratorNormalCompletion = true;
            _context.next = 20;
            break;

          case 33:
            _context.next = 39;
            break;

          case 35:
            _context.prev = 35;
            _context.t0 = _context['catch'](18);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 39:
            _context.prev = 39;
            _context.prev = 40;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 42:
            _context.prev = 42;

            if (!_didIteratorError) {
              _context.next = 45;
              break;
            }

            throw _iteratorError;

          case 45:
            return _context.finish(42);

          case 46:
            return _context.finish(39);

          case 47:
            _context.next = 55;
            break;

          case 49:
            if (!(typeof container === 'string')) {
              _context.next = 53;
              break;
            }

            return _context.abrupt('return', container === userId);

          case 53:
            if (!('id' in container)) {
              _context.next = 55;
              break;
            }

            return _context.abrupt('return', container.id === userId);

          case 55:
            return _context.abrupt('return', false);

          case 56:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[18, 35, 39, 47], [40,, 42, 46]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();