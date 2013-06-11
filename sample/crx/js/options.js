/**
 * Copyright(C) 2013 Kazumasa Kohtaka <kkohtaka@gmail.com>
 */
/*global LiaisonExt: false, chrome: false, console: false */

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

