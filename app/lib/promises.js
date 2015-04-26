module.exports = (function () {
  'use strict';
  var Q = require('q');

  function denodeifySoundclouder() {
    var soundclouder = require('soundclouder');

    return Object.create(Object.prototype, ['auth', 'get'].reduce(function (properties, prop) {
      properties[prop] = {
        configurable: false,
        enumerable: true,
        writable: false,
        value: Q.nfbind(soundclouder[prop])
      };

      return properties;
    }, {}));
  }

  return Object.create(Object.prototype, {
    soundclouder: {
      configrable: false,
      enumerable: true,
      writable: false,
      value: denodeifySoundclouder()
    }
  });
}());
