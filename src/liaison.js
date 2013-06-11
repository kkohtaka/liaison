/**
 * Copyright(C) 2013 Kazumasa Kohtaka <kkohtaka@gmail.com>
 */

/*global console: false */

(function (exports) {

  'use strict';

  exports.Liaison = (function () {

    var
      self = this,
      requestId = 0,
      callbacks = {};

    return {

      listenResponse: function (origin) {

        origin = origin || '*';

        window.addEventListener(
          'message',
          function (event) {

            var
              data = event.data || {},
              wrappedResponse = data.response || {},
              requestId = wrappedResponse.requestId,
              response = wrappedResponse.response,
              callback = callbacks[requestId];

            // ignore messages from other origin if unnecessary
            if (origin !== event.origin && origin !== '*') {

              console.log('ignore message from other origin if necessary');
              return;
            }

            // ignore messages which do not appropriate to RESPONSE
            if (data.type !== 'RESPONSE' || data.from !== 'EXTENSION') {

              return;
            }

            if (callback) {

              delete callbacks[requestId];

              callback.apply(self, [ response ]);
            }
          },
          false
        );

        console.log('listening responses from BACKGROUND...');
      },

      listenRequest: function (origin, callback) {

        if (typeof origin === 'function') {

          callback = origin;
          origin = '*';
        }

        window.addEventListener(
          'message',
          function (event) {

            var
              data = event.data || {},
              wrappedRequest = data.request || {},
              requestId = wrappedRequest.requestId,
              request = wrappedRequest.request || {};

            // ignore messages from other origin if unnecessary
            if (origin !== event.origin && origin !== '*') {

              console.log('ignore message from other origin if necessary');
              return;
            }

            // ignore messages which do not appropriate to REQUEST
            if (data.type !== 'REQUEST' || data.from !== 'EXTENSION') {

              return;
            }

            callback.apply(
              self,
              [
                request,
                function (response) {

                  window.postMessage(
                    {
                      type: 'RESPONSE',
                      from: 'WEB_PAGE',
                      response: {
                        requestId: requestId,
                        response: response
                      }
                    },
                    origin
                  );
                }
              ]
            );
          },
          false
        );

        /*jslint unparam: true */
        this.sendRequest(
          {
            privateAction: 'registerWebPage'
          },
          origin,
          function (response) {

            console.log('listening requests from BACKGROUND...');
          }
        );
        /*jslint unparam: false */
      },

      sendRequest: function (request, targetOrigin, callback) {

        requestId += 1;

        var wrappedRequest = {
          requestId: requestId,
          request: request
        };

        if (typeof targetOrigin === 'function') {

          callback = targetOrigin;
          targetOrigin = '*';
        }

        callbacks[requestId] = callback;

        window.postMessage(
          {
            type: 'REQUEST',
            from: 'WEB_PAGE',
            request: wrappedRequest
          },
          targetOrigin
        );
      }
    };
  }());

}(window));

