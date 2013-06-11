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

