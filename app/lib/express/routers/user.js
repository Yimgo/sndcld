module.exports = (function () {
  'use strict';
  var
    express = require('express'),

    config = require('../../config'),
    ensureAuthenticated = require('../common').ensureAuthenticated,
    UserCollections = require('../../user-collections'),

    router = express.Router();

  router.get('/likes', ensureAuthenticated, function (req, res) {
    var p = req.query.update ? UserCollections.update : UserCollections.fetch;
    p(req.user, 'likes')
      .then(function (likes) {
        res.render('likes', {title: 'likes', user: req.user, collection: likes, clientId: config.CLIENT_ID});
      }, function (err) {
        console.error(err);
        res.render('likes', {title: 'likes', user: req.user, err: err, collection: null});
      });
  });

  return router;
}());
