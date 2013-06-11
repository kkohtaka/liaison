/**
 * Copyright(C) 2013 Kazumasa Kohtaka <kkohtaka@gmail.com>
 */
/*global LiaisonBG: false, chrome: false, console: false */

(function (exports) {

  'use strict';

  exports.LiaisonBG = (function () {

    var listeningTabIds = {};

    function registerWebPage(tabId) {

      listeningTabIds[tabId] = true;
    }

    function deregisterWebPage(tabId) {

      delete listeningTabIds[tabId];
    }

    chrome.tabs.onRemoved.addListener(function (tabId) {

      deregisterWebPage(tabId);
    });

    return {

      listenRequest: function (chrome, callback) {

        chrome.runtime.onMessage.addListener(
          function (request, sender, sendResponse) {

            var tabId = sender.tab.id;

            switch (request.privateAction) {
            case 'registerWebPage':

              registerWebPage(tabId);
              sendResponse({
                message: 'start listening tab id: ' + tabId
              });
              return false;

            case 'deregisterWebPage':

              deregisterWebPage(tabId);
              sendResponse({
                message: 'stop listening tab id: ' + tabId
              });
              return false;

            default:

              return callback(request, tabId, sendResponse);
            }
          }
        );

        console.log('listening requests from WEB_PAGE...');
      },

      sendRequest: function (chrome, tabId, request, callback) {

        chrome.tabs.sendMessage(tabId, request, callback);
      },

      broadcastRequest: function (chrome, request, callback) {

        var
          tabId,
          responses = {},
          numberOfTabIds = Object.keys(listeningTabIds).length;

        function joinResponse(tabId) {

          return function (response) {

            responses[tabId] = response;
            numberOfTabIds -= 1;

            if (numberOfTabIds === 0) {

              callback(responses);
            }
          };
        }

        for (tabId in listeningTabIds) {
          if (listeningTabIds.hasOwnProperty(tabId)) {

            this.sendRequest(chrome, Number(tabId), request, joinResponse(tabId));
          }
        }
      }
    };
  }());

}(window));

