module.exports = (function () {
  'use strict';
  var
    Q = require('q'),

    modules = {
      fs: {
        obj: require('fs'),
        fn: ['readFile']
      },
      soundcloud: {
        obj: require('./soundcloud'),
        fn: ['get']
      }
    };

  function moduleProperties(module) {
    return Object.create(Object.prototype, module.fn.reduce(function (properties, prop) {
      properties[prop] = {
        configurable: false,
        enumerable: true,
        writable: false,
        value: Q.nfbind(module.obj[prop])
      };

      return properties;
    }, {}));
  }

  return Object.create(Object.prototype, Object.keys(modules).reduce(function (properties, key) {
    var module = modules[key];

    properties[key] = {
      configurable: false,
      enumerable: true,
      writable: false,
      value: moduleProperties(module)
    };

    return properties;
  }, {}));
}());
