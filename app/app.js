(function () {
  'use strict';
  var
    createServer = require('./lib/server'),
    app = require('./lib/express/app');

  createServer(app);
}());
