(function () {
  require.config({
    paths: {
      'jquery': '/vendor/foundation/js/vendor/jquery',
      'foundation': '/vendor/foundation/js/foundation'
    },
    shim: {
      'foundation': ['jquery']
    }
  });

  require(['jquery', 'foundation'], function ($) {
    console.log('sndcld: I\'ve been loaded asynchronously.');
    $(document).foundation();
  });
}());
