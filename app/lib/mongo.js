module.exports = function () {
  'use strict';
  var
    MongoClient = require('mongodb').MongoClient,
    Q = require('q'),

    operations = {},
    MONGO_URL = 'mongodb://localhost:27017/sndcld';

  function likes(user) {
    var
      p = Q.defer(),
      db;

    MongoClient.connect(MONGO_URL, function(err, _db) {
      var collection;

      if (err) {
        return p.reject(err);
      }

      db = _db;

      collection = db.collection('' + user.id + '_likes');
      collection.find({}).toArray(function (err, documents) {
        if (err) {
          return p.reject(err);
        }

        p.resolve(documents);
      });
    });

    return p.promise
      .finally(function () {
        db.close();
      });
  }

  function updateLikes (user, data) {
    var
      p = Q.defer(),
      db;

    MongoClient.connect(MONGO_URL, function(err, _db) {
      var collection;

      if (err) {
        return p.reject(err);
      }

      db = _db;

      collection = db.collection('' + user.id + '_likes');
      collection.insert(data, function (err) {
        if (err) {
          return p.reject(err);
        }

        p.resolve();
      });
    });

    return p.promise
      .finally(function () {
        db.close();
      });
  }

  operations.read = {
    likes: likes
  };

  operations.update = {
    likes: updateLikes
  };

  return {
    read: function (user, collection) {
      return operations.read[collection](user);
    },
    update: function (user, collection, data) {
      return operations.update[collection](user, data);
    }
  };
}();
