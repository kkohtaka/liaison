/**
 * Copyright(C) 2013 Kazumasa Kohtaka <kkohtaka@gmail.com>
 */
/*global LiaisonCS: false, chrome: false, console: false */

(function (exports) {

  'use strict';

  exports.LiaisonCS = (function () {

    var
      self = this,
      requestId = 0,
      callbacks = {};

    return {

      relay: function (chrome, origin) {

        origin = origin || '*';

        function relayResponse(response) {

          window.postMessage(
            {
              type: 'RESPONSE',
              from: 'EXTENSION',
              response: response
            },
            origin
          );
        }

        function relayRequest(request, callback) {

          chrome.runtime.sendMessage(request, callback);
        }

        function relayRequestToWebPage(request, callback) {

          requestId += 1;

          var wrappedRequest = {
            requestId: requestId,
            request: request
          };

          callbacks[requestId] = callback;

          window.postMessage(
            {
              type: 'REQUEST',
              from: 'EXTENSION',
              request: wrappedRequest
            },
            origin
          );
        }

        function relayResponseFromWebPage(wrappedResponse) {

          var
            requestId = wrappedResponse.requestId,
            response = wrappedResponse.response,
            callback = callbacks[requestId];

          if (callback) {

            delete callbacks[requestId];

            callback.apply(self, [ response ]);
          }
        }

        // listen requests from WEB_PAGE
        window.addEventListener(
          'message',
          function (event) {

            var
              data = event.data || {},
              wrappedRequest = data.request || {},
              requestId = wrappedRequest.requestId,
              request = wrappedRequest.request;

            // ignore messages from other origin if unnecessary
            if (origin !== event.origin && origin !== '*') {

              console.log('ignore message from other origin if necessary');
              return;
            }

            // ignore messages which do not appropriate to REQUEST
            if (data.type !== 'REQUEST' || data.from !== 'WEB_PAGE') {

              return;
            }

            relayRequest(request, function(response) {

              relayResponse({
                requestId: requestId,
                response: response
              });
            });
          },
          false
        );

        // listen responses from WEB_PAGE
        window.addEventListener(
          'message',
          function (event) {

            var
              data = event.data || {},
              wrappedResponse = data.response || {};

            // ignore messages from other origin if unnecessary
            if (origin !== event.origin && origin !== '*') {

              console.log('ignore message from other origin if necessary');
              return;
            }

            // ignore messages which do not appropriate to RESPONSE
            if (data.type !== 'RESPONSE' || data.from !== 'WEB_PAGE') {

              return;
            }

            relayResponseFromWebPage(wrappedResponse);
          },
          false
        );

        // listen requests from BACKGROUND
        /*jslint unparam: true */
        chrome.runtime.onMessage.addListener(
          function (request, sender, sendResponse) {

            relayRequestToWebPage(request, sendResponse);
            return true;
          }
        );
        /*jslint unparam: false */
      }
    };
  }());

}(window));

