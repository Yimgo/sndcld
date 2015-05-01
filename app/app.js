(function () {
  'use strict';
  var
    express = require('express'),
    soundclouder = require('soundclouder'),

    config = require('./config'),
    User = require('./lib/user'),
    Users = require('./lib/users'),

    app = express(),
    server;

  soundclouder.init(config.CLIENT_ID, config.CLIENT_SECRET, 'http://localhost:3000/callback');

  Users.loadFromFile('./app/config/users.json');

  app.get('/callback', function (req, res) {
    var code = req.query.code;
    console.log('Connection from user with code: %s', code);
    User.create(code)
      .then(function () {
        res.redirect('/index.html');
      }, function (err) {
        console.error('Could not create user (%s)', err);
        res.status(401).end();
      });
  });

  app.use(express.static('app/assets'));
  app.use('/vendor', express.static('bower_components'));

  server = app.listen(3000, function () {
    console.log('App listening at http://%s:%s', server.address().address, server.address().port);
  });
}());
