'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (res, resolve, reject) {

  return {
    serverError: function serverError(data) {
      reject({
        method: 'serverError',
        data: data
      });
    },

    notFound: function notFound(data) {
      reject({
        method: 'notFound',
        data: data
      });
    },

    ok: function ok(results) {
      resolve(results);
    }
  };
};