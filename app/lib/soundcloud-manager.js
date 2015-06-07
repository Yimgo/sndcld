module.exports = function () {
  'use strict';
  var
    qs = require('querystring'),

    MongoClient = require('mongodb').MongoClient,
    Q = require('q'),

    SoundCloud = require('./promises').SoundCloud,

    COLLECTIONS_URL = {
      stream: '/me/activities/all',
      likes: '/me/favorites'
    };

  function fetch(collection, user, params, accumulator) {
    return SoundCloud.get(COLLECTIONS_URL[collection], user.accessToken, params)
      .then(function (res) {
        var nextParams;

        accumulator = accumulator.concat(res.collection);

        if (res['next_href']) {
          nextParams = qs.parse(res['next_href'].split('?')[1]);
          return fetch(collection, user, nextParams, accumulator);
        }
        return Q.resolve(accumulator);
      });
  }

  function likes(user) {
    return fetch('likes', user, {limit: 200, 'linked_partitioning': 1}, []);
  }

  return {
    likes: likes
  };
}();
