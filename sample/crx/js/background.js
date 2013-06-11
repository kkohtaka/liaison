/**
 * Copyright(C) 2013 Kazumasa Kohtaka <kkohtaka@gmail.com>
 */
/*global LiaisonBG: false, chrome: false, console: false */

(function (LiaisonBG, chrome) {

  'use strict';

  /*jslint unparam: true */
  LiaisonBG.listenRequest(chrome, function (request, tabId, sendResponse) {

    console.log('request: ', request.message);

    switch (request.action) {
    case 'broadcast':
      LiaisonBG.broadcastRequest(chrome, request, function (response) {
        sendResponse(response);
      });
      return true;

    default:
      sendResponse({ message: 'I am from BACKGROUND.' });
      return false;
    }
  });
  /*jslint unparam: false */

}(LiaisonBG, chrome));

