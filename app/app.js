(function () {
  'use strict';
  var
    express = require('express'),
    session = require('express-session'),
    passport = require('passport'),
    SoundCloudStrategy = require('passport-soundcloud').Strategy,
    soundclouder = require('soundclouder'),

    config = require('./config'),
    User = require('./lib/user'),

    app = express(),
    server;

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
    res.render('index', {user: req.user});
  });

  app.get('/stream', ensureAuthenticated, function (req, res) {
    req.user.activities()
      .then(function (activities) {
        res.json(activities.collection);
      });
  });

  app.get('/auth', passport.authenticate('soundcloud'));

  app.get('/auth/callback', passport.authenticate('soundcloud', { failureRedirect: '/?login=failure' }), function(req, res) {
    res.redirect('/');
  });

  server = app.listen(3000, function () {
    console.log('App listening at http://%s:%s', server.address().address, server.address().port);
  });
}());
