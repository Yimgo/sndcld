(function () {
  'use strict';
  var
    fs = require('fs'),
    https = require('https'),
    path = require('path'),

    express = require('express'),
    session = require('express-session'),
    passport = require('passport'),
    FileStore = require('session-file-store')(session),
    SoundCloudStrategy = require('passport-soundcloud').Strategy,
    Q = require('q'),

    config = require('./config'),
    User = require('./lib/user'),

    app = express(),
    server;

  function getSSLOptions() {
    return {
      key: fs.readFileSync(path.join(config.SSL_PATH, 'server.key')),
      cert: fs.readFileSync(path.join(config.SSL_PATH, 'server.crt')),
      ca: fs.readFileSync(path.join(config.SSL_PATH, 'ca.crt'))
    };
  }

  function ensureAuthenticated(req, res, next) {
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
  app.use(express.static('assets'));
  app.use('/vendor', express.static('bower_components'));
  app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    store: new FileStore({
      ttl: 7 * 24 * 60 * 60
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/', function (req, res) {
    res.render('pages/index', {user: req.user});
  });

  app.get('/likes', ensureAuthenticated, function (req, res) {
    req.user.likes()
      .then(function (likes) {
        res.render('pages/likes', {user: req.user, collection: likes, clientId: config.CLIENT_ID});
      });
  });

  app.get('/auth', passport.authenticate('soundcloud'));

  app.get('/auth/callback', passport.authenticate('soundcloud', { failureRedirect: '/?login=failure' }), function(req, res) {
    res.redirect('/');
  });

  server = https.createServer(getSSLOptions(), app).listen(3000, function () {
    console.log('App listening at https://%s:%s', server.address().address, server.address().port);
  });
}());
