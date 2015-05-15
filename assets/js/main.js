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
    $(document).foundation();
  });
}());
