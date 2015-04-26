module.exports = (function () {
  'use strict';
  var
    Q = require('q'),

    soundclouder = require('./promises').soundclouder;

  function User(accessToken) {
    Object.defineProperties(this, {
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
            console.info(me);
            this.name = me.username;
          }.bind(this));
      } else {
        return Q.reject(new Error('User: could not populate user (missing token)'));
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
