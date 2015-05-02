(function () {
  'use strict';
  var
    fs = require('fs'),
    https = require('https'),
    path = require('path'),

    express = require('express'),
    session = require('express-session'),
    passport = require('passport'),
    SoundCloudStrategy = require('passport-soundcloud').Strategy,
    Q = require('q'),

    config = require('./config'),
    User = require('./lib/user'),
    SoundCloud = require('./lib/promises').SoundCloud,

    app = express(),
    server;

  function getSSLOptions () {
    return {
      key: fs.readFileSync(path.join(config.SSL_PATH, 'server.key')),
      cert: fs.readFileSync(path.join(config.SSL_PATH, 'server.crt')),
      ca: fs.readFileSync(path.join(config.SSL_PATH, 'ca.crt'))
    };
  }

  function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.sendStatus(401);
  }

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, new User(obj.accessToken, obj.refreshToken, {
      id: obj.id,
      displayName: obj.name
    }));
  });

  passport.use(new SoundCloudStrategy({
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    callbackURL: config.CALLBACK_URL
  }, function (accessToken, refreshToken, profile, done) {
    return done(null, new User(accessToken, refreshToken, profile));
  }));

  app.set('views', 'app/views');
  app.set('view engine', 'ejs');
  app.use(express.static('app/assets'));
  app.use('/vendor', express.static('bower_components'));
  app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/', function (req, res) {
    res.redirect('/stream');
  });

  app.get('/stream', ensureAuthenticated, function (req, res) {
    if (req.user) {
      req.user.activities()
        .then(function (activities) {
          return Q
            .all(activities.collection.map(function (activity) {
              return SoundCloud.get('/oembed', undefined, {
                format: 'json',
                url: activity.origin.uri
              });
            }))
            .then(function (oembeds) {
              res.render('index', {user: req.user, collection: oembeds});
            });
        });
    } else {
      res.render('index', {user: req.user, collection: null});
    }
  });

  app.get('/auth', passport.authenticate('soundcloud'));

  app.get('/auth/callback', passport.authenticate('soundcloud', { failureRedirect: '/?login=failure' }), function(req, res) {
    res.redirect('/stream');
  });

  server = https.createServer(getSSLOptions(), app).listen(3000, function () {
    console.log('App listening at https://%s:%s', server.address().address, server.address().port);
  });
}());
