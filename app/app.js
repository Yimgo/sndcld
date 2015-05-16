(function () {
  'use strict';
  var
    fs = require('fs'),
    https = require('https'),
    path = require('path'),

    express = require('express'),
    exphbs  = require('express-handlebars'),
    session = require('express-session'),
    passport = require('passport'),
    FileStore = require('session-file-store')(session),
    SoundCloudStrategy = require('passport-soundcloud').Strategy,
    Q = require('q'),

    config = require('./config'),
    User = require('./lib/user'),

    app = express(),
    server,
    hbs;

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

  hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials')
  });

  app.engine('handlebars', hbs.engine);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'handlebars');
  app.use(express.static(path.join(__dirname, '..', 'assets')));
  app.use('/vendor', express.static(path.join(__dirname, '..',  'bower_components')));
  app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    store: new FileStore({
      path: path.join(__dirname, '..', 'sessions'),
      ttl: 7 * 24 * 60 * 60
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/', function (req, res) {
    res.render('home', {title: 'home', user: req.user});
  });

  app.get('/likes', ensureAuthenticated, function (req, res) {
    req.user.likes()
      .then(function (likes) {
        res.render('likes', {title: 'likes', user: req.user, collection: likes, clientId: config.CLIENT_ID});
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
