module.exports = (function () {
  'use strict';

  var
    https = require('https'),
    qs = require('querystring'),

    client_id = require('../config').CLIENT_ID,
    host_api = 'api.soundcloud.com';

  /* borrowed from https://github.com/khilnani/soundclouder.js */
  function call(method, path, access_token, params, callback) {
    if (path && path.indexOf('/') == 0) {
      if (typeof (params) == 'function') {
        callback = params;
        params = {};
      }
      callback = callback || function () {};
      params = params || {};
      if (access_token !== "") {
        params.oauth_token = access_token;
      } else {
        params.client_id = client_id;
      }
      params.format = 'json';
      return request({
        method: method,
        uri: host_api,
        path: path,
        qs: params
      }, callback);
    } else {
      callback({
        message: 'Invalid path: ' + path
      });
      return false;
    }
  }

  function request(data, callback) {
      var qsdata = (data.qs) ? qs.stringify(data.qs) : '';
      var paramChar = data.path.indexOf('?') >= 0 ? '&' : '?';
      var options = {
        hostname: data.uri,
        path: data.path + paramChar + qsdata,
        method: data.method
      };

      if (data.method == 'POST') {
        options.path = data.path;
        options.headers = {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Content-Length': qsdata.length
        };
      }

      var req = https.request(options, function (response) {
        var body = "";
        response.on('data', function (chunk) {
          body += chunk;
          //log.trace("chunk: " + chunk);
        });
        response.on('end', function () {
          try {
            var d = JSON.parse(body);
            // See http://developers.soundcloud.com/docs/api/guide#errors for full list of error codes
            if (Number(response.statusCode) >= 400) {
              callback(d.errors, d);
            } else {
              callback(undefined, d);
            }
          } catch (e) {
            callback(e);
          }
        });
      });

      req.on('error', function (e) {
        log.error("For Request: " + options.method + '; ' + options.hostname + options.path);
        log.error("Request error: " + e.message);
        callback(e);
      });

      if (data.method == 'POST') {
        log.debug("POST Body: " + qsdata);
        req.write(qsdata);
      }

      req.end();
    }
    return {
      get: function (path, access_token, params, callback) {
        call('GET', path, access_token, params, callback);
      },
      post: function (path, access_token, params, callback) {
        call('POST', path, access_token, params, callback);
      },
      put:function (path, access_token, params, callback) {
        call('PUT', path, access_token, params, callback);
      },
      delete:function (path, access_token, params, callback) {
        call('DELETE', path, access_token, params, callback);
      }
    }
}());
