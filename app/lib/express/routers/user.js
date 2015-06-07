module.exports = (function () {
  'use strict';
  var
    express = require('express'),

    config = require('../../config'),
    ensureAuthenticated = require('../common').ensureAuthenticated,
    SoundCloudManager = require('../../soundcloud-manager'),

    router = express.Router();

  router.get('/likes', ensureAuthenticated, function (req, res) {
    SoundCloudManager.likes(req.user)
      .then(function (likes) {
        res.render('likes', {title: 'likes', user: req.user, collection: likes, clientId: config.CLIENT_ID});
      }, function (err) {
        console.error(err);
        res.render('likes', {title: 'likes', user: req.user, err: err, collection: null});
      });
  });

  return router;
}());
