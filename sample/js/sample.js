/**
 * Copyright(C) 2013 Kazumasa Kohtaka <kkohtaka@gmail.com>
 */

/*global console: false */

(function (Liaison) {

  'use strict';

  Liaison.sendRequest(
    {
      message: 'I am from WEB_PAGE.'
    },
    function (response) {

      console.log('response from BACKGROUND: ', response.message);
    }
  );

  Liaison.listenRequest(function (request, callback) {

    console.log('request: ', request.message);

    callback({
      message: 'I am from WEB_PAGE'
    });
  });

}(Liaison));

