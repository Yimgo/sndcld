module.exports = (function () {
  'use strict';
  var
    fs = require('fs'),
    https = require('https'),
    path = require('path'),

    config = require('./config');

  function getSSLOptions() {
    return {
      key: fs.readFileSync(path.join(config.SSL_PATH, 'server.key')),
      cert: fs.readFileSync(path.join(config.SSL_PATH, 'server.crt')),
      ca: fs.readFileSync(path.join(config.SSL_PATH, 'ca.crt'))
    };
  }

  return function createServer(app) {
    return https.createServer(getSSLOptions(), app).listen(3000, function () {
      console.log('App listening at https://%s:%s', this.address().address, this.address().port);
    });
  };
}());
