module.exports = (function () {
  'use strict';
  return Object.create(Object.prototype, {
    CLIENT_ID: {
      enumerable: true,
      get: function () {
        return process.env.SNDCLD_CLIENT_ID;
      }
    },
    CLIENT_SECRET: {
      enumerable: true,
      get: function () {
        return process.env.SNDCLD_CLIENT_SECRET;
      }
    },
    CALLBACK_URL: {
      enumerable: true,
      get: function () {
        return process.env.SNDCLD_CALLBACK_URL;
      }
    },
    SSL_PATH: {
      enumerable: true,
      get: function () {
        return process.env.SNDCLD_SSL_PATH
      }
    }
  });
}());
