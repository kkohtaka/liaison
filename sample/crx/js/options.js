/**
 * Copyright(C) 2013 Kazumasa Kohtaka <kkohtaka@gmail.com>
 */
/*global LiaisonExt: false, chrome: false, console: false */

(function (exports) {

  'use strict';

  exports.LiaisonExt = (function () {

    return {

      sendResponse: function (chrome, request, callback) {

        chrome.runtime.sendMessage(request, callback);
      }
    };

  }());

}(window));

(function (LiaisonExt, chrome) {

  'use strict';

  LiaisonExt.sendResponse(
    chrome,
    {
      action: 'broadcast',
      message: 'I am from OPTIONS_PAGE.'
    },
    function (response) {

      console.log('response from BACKGROUND: ', response);
    }
  );

}(LiaisonExt, chrome));

