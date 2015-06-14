module.exports = function () {
  'use strict';

  var
    MongoWrapper = require('./mongo'),
    SoundCloudManager = require('./soundcloud-manager');

  return {
    fetch: function (user, collection) {
      return MongoWrapper.read(user, collection);
    },
    update: function (user, collection) {
      return SoundCloudManager[collection](user)
        .then(function (data) {
          return MongoWrapper.update(user, collection, data);
        })
        .then(function () {
          return MongoWrapper.read(user, collection);
        });
    }
  };
}();
