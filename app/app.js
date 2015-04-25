var
  express = require('express'),
  app = express(),
  server;

app.use(express.static('app/assets'));

server = app.listen(3000, function () {
  console.log('App listening at http://%s:%s', server.address().address, server.address().port);
});
