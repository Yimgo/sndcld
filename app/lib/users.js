module.exports = (function () {
  'use strict';
  var
    Q = require('q'),

    fs = require('./promises').fs,
    User = require('./user');

  function Users(users) {
    Object.defineProperty(this, 'list', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: users
    });
  }

  Users.prototype = {
    get: function (id) {
      return this.list.find(function (user) {
        return user.id === id;
      });
    }
  };

  Users.load = function (rawUsers) {
    return Q
      .all(rawUsers.map(function (user) {
        return new User(user.accessToken).populate();
      }))
      .then(function (users) {
        return new Users(users);
      });
  };

  Users.loadFromFile = function (filename) {
    return fs.readFile(filename, 'utf8')
      .then(function (data) {
        return JSON.parse(data);
      })
      .then(Users.load);
  };

  return Users;
}());
