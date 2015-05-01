module.exports = (function () {
  'use strict';
  var
    Q = require('q'),

    soundclouder = require('./promises').soundclouder;

  function User(accessToken, refreshToken, profile) {
    Object.defineProperties(this, {
      id: {
        configurable: false,
        enumerable: true,
        writable: true,
        value: profile.id
      },
      name: {
        configurable: false,
        enumerable: true,
        writable: true,
        value: profile.displayName
      },
      accessToken: {
        configurable: false,
        enumerable: true,
        writable: true,
        value: accessToken
      },
      refreshToken: {
        configurable: false,
        enumerable: true,
        writable: true,
        value: refreshToken
      }
    });
  }

  User.prototype = {
    stream: function () {
      if (this.accessToken) {
        return soundclouder.get('/me/activities/all', this.accessToken, {limit: 10});
      } else {
        return Q.reject(new Error('User: could not get user stream (missing token)'));
      }
    }
  };

  return User;
}());
