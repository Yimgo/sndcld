module.exports = (function () {
  'use strict';
  var
    express = require('express'),

    config = require('../../config'),
    ensureAuthenticated = require('../common').ensureAuthenticated,

    router = express.Router();

  router.get('/likes', ensureAuthenticated, function (req, res) {
    req.user.likes()
      .then(function (likes) {
        res.render('likes', {title: 'likes', user: req.user, collection: likes, clientId: config.CLIENT_ID});
      });
  });

  return router;
}());
