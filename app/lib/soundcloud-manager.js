module.exports = function () {
  'use strict';
  var
    qs = require('querystring'),

    Q = require('q'),

    SoundCloud = require('./promises').SoundCloud,

    COLLECTIONS_URL = {
      stream: '/me/activities/all',
      likes: '/me/favorites'
    };

  function fetch(collection, user) {
    var
     deferred = Q.defer(),
     accumulator = [];

    function doFetch(collection, user, params) {
      SoundCloud.get(COLLECTIONS_URL[collection], user.accessToken, params)
        .then(function (res) {
          var nextParams;

          accumulator = accumulator.concat(res.collection);

          if (res['next_href']) {
            nextParams = qs.parse(res['next_href'].split('?')[1]);
            doFetch(collection, user, nextParams);
          } else {
            deferred.resolve(accumulator);
          }
        });
    }
    doFetch(collection, user, {limit: 200, 'linked_partitioning': 1});
    return deferred.promise;
  }

  function likes(user) {
    return fetch('likes', user);
  }

  return {
    likes: likes
  };
}();
