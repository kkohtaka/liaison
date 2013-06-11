/**
 * Copyright(C) 2013 Kazumasa Kohtaka <kkohtaka@gmail.com>
 */

/*global LiaisonExt: false, chrome: false, console: false */

(function (exports) {

  'use strict';

  /**
   * @namespace LiaisonExt
   */
  exports.LiaisonExt = (function () {

    return {

      /**
       * @callback LiaisonExt.ResponseListener
       * @param {Object} response
       */

      /**
       * @alias LiaisonExt.sendResponse
       * @param {ChromeExtension} chrome
       * @param {Object} request
       * @param {LiaisonExt.ResponseListener} callback
       */
      sendResponse: function (chrome, request, callback) {

        chrome.runtime.sendMessage(request, callback);
      }
    };

  }());

}(window));

