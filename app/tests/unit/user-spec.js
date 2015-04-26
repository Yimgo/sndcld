'use strict';
var
  chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  proxyquire = require('proxyquire'),
  Q = require('q'),

  expect = chai.expect,
  User = proxyquire('../../lib/user', {
    './promises': (function () {
      var accessToken = 'foo';

      return {
        soundclouder: {
          auth: function () {
            return Q(accessToken);
          },
          get: function (path, token) {
            if (token === accessToken) {
              return Q({
                id: 81391991,
                kind: 'user',
                permalink: 'yimgo',
                username: 'Yimgo',
                last_modified: '2015/04/13 20:03:09 +0000',
                uri: 'https://api.soundcloud.com/users/81391991',
                permalink_url: 'http://soundcloud.com/yimgo',
                avatar_url: 'https://i1.sndcdn.com/avatars-000078718555-dftrsj-large.jpg',
                country: 'France',
                first_name: 'Guillaume',
                last_name: 'Burel',
                full_name: 'Guillaume Burel',
                description: '',
                city: 'Lyon',
                discogs_name: null,
                myspace_name: null,
                website: 'http://yimgo.fr',
                website_title: null,
                online: false,
                track_count: 0,
                playlist_count: 2,
                plan: 'Free',
                public_favorites_count: 541,
                followers_count: 40,
                followings_count: 306,
                subscriptions: [],
                upload_seconds_left: 10800,
                quota: {
                  unlimited_upload_quota: false,
                  upload_seconds_used: 0,
                  upload_seconds_left: 10800
                },
                private_tracks_count: 0,
                private_playlists_count: 1,
                primary_email_confirmed: true,
                locale: 'en'
              });
            } else {
              return Q.reject(new Error('Dummy error'));
            }
          }
        }
      };
    }())
  });

chai.use(chaiAsPromised);

it('should create a valid user from a code', function () {
  // when
  var when = User.create('foo');

  // then
  return when
    .then(function (user) {
      expect(user.name).to.equal('Yimgo');
    });
});

it('should fail when the access token is not valid', function () {
  // given
  var
    user = new User('bar'),
    when;

  // when
  when = user.populate();

  // then
  return expect(when).to.be.rejected;
});
