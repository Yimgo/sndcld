module.exports = (function () {
  'use strict';
  var
    path = require('path'),

    session = require('express-session'),
    passport = require('passport'),
    FileStore = require('session-file-store')(session),
    SoundCloudStrategy = require('passport-soundcloud').Strategy,

    config = require('../config'),
    User = require('../user');

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

  return function decorate(app) {
    app.use(session({
      secret: 'keyboard cat',
      resave: true,
      saveUninitialized: true,
      store: new FileStore({
        path: path.join(__dirname, '..', '..', 'sessions'),
        ttl: 7 * 24 * 60 * 60
      })
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/auth', passport.authenticate('soundcloud'));

    app.get('/auth/callback', passport.authenticate('soundcloud', { failureRedirect: '/?login=failure' }), function(req, res) {
      res.redirect('/');
    });
  };
}());
