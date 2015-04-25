var
  express = require('express'),
  sc = require('soundclouder'),
  Q = require('q'),

  config = require('./config'),

  app = express(),
  server;

sc.init(config.CLIENT_ID, config.CLIENT_SECRET, 'http://localhost:3000/callback');

function authenticate(code) {
  return Q.nfcall(sc.auth, code)
    .then(function (token) {
      return Q.Promise(function (resolve, reject) {
        if (token) {
          resolve(token);
        } else {
          reject(new Error('Bad token'));
        }
      });
    });
}

app.get('/callback', function (req, res) {
  var code = req.query.code;
  console.log('Connection from user with code: %s', code);
  authenticate(code)
    .then(function (access_token) {
      console.log('Got access token %s', access_token);
      res.status(200).end();
    }, function (err) {
      console.error('Could not authenticate (%s)', err);
      res.status(401).end();
    });
});

app.use(express.static('app/assets'));

server = app.listen(3000, function () {
  console.log('App listening at http://%s:%s', server.address().address, server.address().port);
});
