'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (req, filters) {

  var whereCriterias = _actionUtil2.default.parseCriteria(req);
  var sortCriteria = _actionUtil2.default.parseSort(req);

  for (var attribute in whereCriterias) {
    if (filters.allowed.indexOf(attribute) < 0) throw new Error(_messageUtil2.default.criteriaErrorMessages(attribute).where);
  }

  if (!sortCriteria) return true;
  var sanitized = sortCriteria.replace(/asc|desc/g, '').trim();
  if (filters.allowed.indexOf(sanitized) < 0) throw new Error(_messageUtil2.default.criteriaErrorMessages(sanitized).sort);

  return true;
};

var _actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

var _actionUtil2 = _interopRequireDefault(_actionUtil);

var _messageUtil = require('../util/messageUtil');

var _messageUtil2 = _interopRequireDefault(_messageUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }