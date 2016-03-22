"use strict";

var page = require('webpage').create();

//para finger que es un movil
page.settings.userAgent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36';
page.settings.javascriptEnabled = true;

//set browser en ingles
page.customHeaders = {
  "Accept-Language": "en-US"
};

page.onUrlChanged = function(targetUrl) {
  console.log('New URL: ' + targetUrl);
};
page.onLoadFinished = function(status) {
  console.log('Load Finished: ' + status);
};
// console.log('Load Started');
page.onLoadStarted = function() {
  console.log('onLoadStarted');
};
page.onNavigationRequested = function(url, type, willNavigate, main) {
  console.log('Trying to navigate to: ' + url);
};

page.onError = function(msg, trace) {

  var msgStack = ['ERROR: ' + msg];

  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
    });
  }

  console.error(msgStack.join('\n'));

};

page.open('https://mobile.bet365.com/#type=InPlay;key=18;ip=1;lng=1', function(status) {
  if (status === "success") {
    console.log("Exito al abrir pagina.");
    if(phantom.injectJs('util.js')){
      console.log('success loading util.js');
      page.evaluate(function() {
        try {
          console.log('inside evaluate', arguments[0]);
        } catch (e) {
          console.log('Error', err.message);
        }
      }, waitFor);
    }else{
      console.log('error to load util.js');
    }
    phantom.exit();
  }
});


page.onConsoleMessage = function(msg) {
  console.log(msg);
}
