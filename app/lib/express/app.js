module.exports = (function () {
  'use strict';
  var
    path = require('path'),

    express = require('express'),

    config = require('../config'),
    sessionDecorator = require('./session'),
    templatesDecorator = require('./templates'),

    app;

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.sendStatus(401);
  }

  app = express();

  sessionDecorator(app);
  templatesDecorator(app);

  app.use(express.static(path.join(__dirname, '..', '..', '..', 'assets')));
  app.use('/vendor', express.static(path.join(__dirname, '..', '..', '..', 'bower_components')));

  app.get('/', function (req, res) {
    res.render('home', {title: 'home', user: req.user});
  });

  app.get('/likes', ensureAuthenticated, function (req, res) {
    req.user.likes()
      .then(function (likes) {
        res.render('likes', {title: 'likes', user: req.user, collection: likes, clientId: config.CLIENT_ID});
      });
  });

  return app;
}());
