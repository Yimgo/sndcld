var config = Object.create(Object.prototype, {
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
  OAUTH_TOKEN: {
    enumerable: true,
    get: function () {
      return process.env.SNDCLD_OAUTH_TOKEN;
    }
  }
});

module.exports = config;
