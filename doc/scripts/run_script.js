(function ($) {

  prettyPrint();

  $(document).ready(function () {

    function updateLanguage (english) {

      if (english) {

        $('.en').show();
        $('.ja').hide();
        $('.language-toggle').text('言語を日本語へ変更する');

      } else {

        $('.en').hide();
        $('.ja').show();
        $('.language-toggle').text('Change Language to English');
      }
    }

    var english = ($.cookie('language') === 'english');
    updateLanguage(english);

    $('.language-toggle').on('click', function (event) {

      event.preventDefault();

      english = !english;

      $.cookie('language', english ? 'english' : 'japanese');
      updateLanguage(english);
    });
  });
}(jQuery));
