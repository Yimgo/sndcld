module.exports = (function () {
  'use strict';
  var
    path = require('path'),
    exphbs = require('express-handlebars'),
    hbs;

  hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '..', '..', 'views', 'layouts'),
    partialsDir: path.join(__dirname, '..', '..', 'views', 'partials')
  });

  return function decorate(app) {
    app.engine('handlebars', hbs.engine);
    app.set('views', path.join(__dirname, '..', '..', 'views'));
    app.set('view engine', 'handlebars');
  };
}());
