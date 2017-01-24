'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req) {
    var model, modelId, userId, modelInDb, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _owner;

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
            return sails.models[model].findOne(modelId);

          case 7:
            modelInDb = _context.sent;

            if (modelInDb) {
              _context.next = 10;
              break;
            }

            throw new Error('model not found - id given in parameter is not valid');

          case 10:
            if (!(req.user.role === 'admin')) {
              _context.next = 12;
              break;
            }

            return _context.abrupt('return', true);

          case 12:
            if (!('owner' in modelInDb)) {
              _context.next = 54;
              break;
            }

            if (!(owner instanceof Array)) {
              _context.next = 47;
              break;
            }

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 17;
            _iterator = modelInDb.owners[Symbol.iterator]();

          case 19:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 31;
              break;
            }

            _owner = _step.value;

            if (!(typeof _owner === 'string')) {
              _context.next = 26;
              break;
            }

            if (!(_owner === userId)) {
              _context.next = 24;
              break;
            }

            return _context.abrupt('return', true);

          case 24:
            _context.next = 28;
            break;

          case 26:
            if (!(_owner.id === userId)) {
              _context.next = 28;
              break;
            }

            return _context.abrupt('return', true);

          case 28:
            _iteratorNormalCompletion = true;
            _context.next = 19;
            break;

          case 31:
            _context.next = 37;
            break;

          case 33:
            _context.prev = 33;
            _context.t0 = _context['catch'](17);
            _didIteratorError = true;
            _iteratorError = _context.t0;

          case 37:
            _context.prev = 37;
            _context.prev = 38;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 40:
            _context.prev = 40;

            if (!_didIteratorError) {
              _context.next = 43;
              break;
            }

            throw _iteratorError;

          case 43:
            return _context.finish(40);

          case 44:
            return _context.finish(37);

          case 45:
            _context.next = 52;
            break;

          case 47:
            if (!(typeof owner === 'string')) {
              _context.next = 51;
              break;
            }

            return _context.abrupt('return', owner === userId);

          case 51:
            return _context.abrupt('return', owner.id === userId);

          case 52:
            _context.next = 55;
            break;

          case 54:
            return _context.abrupt('return', false);

          case 55:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[17, 33, 37, 45], [38,, 40, 44]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();