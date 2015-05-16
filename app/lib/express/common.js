module.exports = (function () {
  'use strict';

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.sendStatus(401);
  }

  return {
    ensureAuthenticated: ensureAuthenticated
  };
}());
