module.exports = (function () {
  'use strict';
  var
    SoundCloud = require('./promises').SoundCloud;

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
    activities: function () {
      return SoundCloud.get('/me/activities/all', this.accessToken, {limit: 10});
    },
    likes: function () {
      return SoundCloud.get('/me/favorites', this.accessToken, {limit: 10});
    }
  };

  return User;
}());
