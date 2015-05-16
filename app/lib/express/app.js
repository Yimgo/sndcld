module.exports = (function () {
  'use strict';
  var
    path = require('path'),

    express = require('express'),

    sessionDecorator = require('./session'),
    templatesDecorator = require('./templates'),
    user = require('./routers/user'),

    app;

  app = express();

  sessionDecorator(app);
  templatesDecorator(app);

  app.use(express.static(path.join(__dirname, '..', '..', '..', 'assets')));
  app.use('/vendor', express.static(path.join(__dirname, '..', '..', '..', 'bower_components')));

  app.get('/', function (req, res) {
    res.render('home', {title: 'home', user: req.user});
  });
  app.use('/user', user);

  return app;
}());
