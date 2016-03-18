//debugging
//phantomjs --remote-debugger-port=9000  script.js
"use strict";

function waitFor(testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 20000, //< Default Max Timout is 3s
    start = new Date().getTime(),
    condition = false,
    interval = setInterval(function() {
      //page.render('example.png');
      //debugger;
      if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
        // If not time-out yet and condition not yet fulfilled
        condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
        page.evaluate(function() {});
      } else {

        if (!condition) {
          //page.render('example.png');
          // If condition still not fulfilled (timeout but condition is 'false')
          console.log("'waitFor()' timeout");
          phantom.exit(1);
        } else {
          // Condition fulfilled (timeout and/or condition is 'true')
          console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
          typeof(onReady) === "string" ? eval(onReady): onReady(); //< Do what it's supposed to do once the condition is fulfilled
          clearInterval(interval); //< Stop this interval
        }
      }
    }, 250); //< repeat check every 250ms
};



var page = require('webpage').create();
//page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
page.settings.userAgent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36';
page.settings.javascriptEnabled = true;
// Open Twitter on 'sencha' profile and, onPageLoad, do...
page.open('https://mobile.bet365.com/#type=InPlay', function(status) {
  //page.open('https://web.whatsapp.com/', function (status) {
  console.log('trying open', status);
  // Check for page load success
  if (status !== "success") {
    console.log("Unable to access network");
  }
  /*else {
		//console.log("jquery: ", jQuery != undefined);
		//console.log("$: ", $ != undefined);
		//page.render('example.png');
		//page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
			// Wait for 'signin-dropdown' to be visible
			waitFor(function() {
				// Check in the page if a specific element is now visible
				return page.evaluate(function() {
					console.log('IconContainer ', $("[data-nav=InPlay]").prop('outerHTML'));
					return $("[data-nav=InPlay]") != undefined;
				});

			}, function() {
			   console.log("The sign-in dialog should be visible now.");
			   page.render('example2.png');
			   phantom.exit();
			});
		//});
    }*/
});

page.onConsoleMessage = function(msg) {
  console.log(msg);
}

page.onLoadFinished = function(status) {
  console.log('Status finish: ' + status);
  setTimeout(function() {
    var list_like_plays = [];
      page.render('example3.png');

      page.evaluate(function() {
        //click basketball menu
        $("[data-cid=18]")[0].click();

        //click live-inPlay basketball menu
        $("[data-cid=18]")[0].click();

        //retrieve times of basketball live-inPlay
        $(".ipo-Fixture.ipo-Fixture_TimedFixture").each(function(index, item) {
          var div = $(item).find("[class='ipo-Fixture_GameInfo ']").text(),
            minuto = parseInt(div.split(':')[0]);
          if (minuto <= 5) {
            list_like_plays.push(item);
            console.log(parseInt(div.split(':')[0]))
          }
        })
        list_like_plays.forEach(function(item){
          item.click();
        })

      });

      phantom.exit();
    }, 5000)
    // Do other things here...
};
/*
page.onPageCreated = function(newPage) {
  page.render('example2.png');
}; */
