module.exports = (function () {
  'use strict';
  var
    Q = require('q'),

    soundclouder = require('./promises').soundclouder;

  function User(accessToken) {
    Object.defineProperties(this, {
      id: {
        configurable: false,
        enumerable: true,
        writable: true
      },
      name: {
        configurable: false,
        enumerable: true,
        writable: true
      },
      accessToken: {
        configurable: false,
        enumerable: false,
        writable: true,
        value: accessToken
      }
    });
  }

  User.prototype = {
    authenticate: function (code) {
      return soundclouder.auth(code)
        .then(function (token) {
          return Q.Promise(function (resolve, reject) {
            if (token) {
              this.accessToken = token;
              resolve();
            } else {
              reject(new Error('User: could not get access token'));
            }
          }.bind(this));
        }.bind(this));
    },
    populate: function () {
      if (this.accessToken) {
        return soundclouder.get('/me', this.accessToken)
          .then(function (me) {
            this.id = me.id;
            this.name = me.username;
          }.bind(this))
          .thenResolve(this);
      } else {
        return Q.reject(new Error('User: could not populate user (missing token)'));
      }
    },
    stream: function () {
      if (this.accessToken) {
        return soundclouder.get('/me/activities/all', this.accessToken, {limit: 10});
      } else {
        return Q.reject(new Error('User: could not get user stream (missing token)'));
      }
    }
  };

  User.create = function (code) {
    var user = new User();
    return user.authenticate(code)
      .then(function () {
        return user.populate();
      })
      .thenResolve(user);
  };

  return User;
}());
