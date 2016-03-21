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

//para finger que es un movil
page.settings.userAgent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36';
page.settings.javascriptEnabled = true;
//set browser en ingles
page.customHeaders = {
  "Accept-Language": "en-US,en;q=0.5"
};
// Open Twitter on 'sencha' profile and, onPageLoad, do...
page.open('https://mobile.bet365.com/#type=InPlay;key=18;ip=1;lng=1', function(status) {
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

page.onCallback = function(data) {
  if (data.exit) {
    page.render('imgName.png');
    //page.render('pdfName.pdf');
    phantom.exit();
  }
};

page.onLoadFinished = function(status) {
  console.log('Status finish: ' + status);
  setTimeout(function() {
    page.render('example3.png');
    //page.evaluateAsync(function() {
    page.evaluate(function() {
        debugger; // step 9 will wait here in the second web browser tab


      function objToString(obj) {
        var str = '';
        for (var p in obj) {
          if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
          }
        }
        return str;
      }

      // function click(el){
      //     var ev = document.createEvent("MouseEvent");
      //     ev.initMouseEvent(
      //         "click",
      //         true /* bubble */, true /* cancelable */,
      //         window, null,
      //         0, 0, 0, 0, /* coordinates */
      //         false, false, false, false, /* modifier keys */
      //         0 /*left*/, null
      //     );
      //     el.dispatchEvent(ev);
      // }

      var list_like_plays = [];
      var resultado = '';
      //pause(3000);
      //click basketball menu
      //$("[data-cid=18]")[0].click();
      //click live-inPlay basketball menu
      //$("[data-cid=18]")[0].click();

      //pause(3000);
      console.log('juegos lives de basketball', $(".ipo-Fixture.ipo-Fixture_TimedFixture").find("[class='ipo-Fixture_GameInfo ']").text());
      //retrieve times of basketball live-inPlay
      $(".ipo-Fixture.ipo-Fixture_TimedFixture").each(function(index, item) {
          var div = $(item).find("[class='ipo-Fixture_GameInfo ']").text(),
            minuto = parseInt(div.split(':')[0]),
            cuarto = $(item).find(".ipo-Fixture_GameInfo.ipo-Fixture_GameInfo-2").text();
          console.log('minuto:' + minuto + '\n')
          console.log('cuarto: ' + cuarto + ' ' + cuarto.length + '\n')
          if (minuto <= 12 && minuto > 2 && cuarto.length < 3) {
            var cuartoActual = parseInt(cuarto.substring(1))
            item.cuartoActual = cuartoActual;
            list_like_plays.push(item);
          }
        })
        //console.log(objToString(list_like_plays[0]));
      console.log('lista de juegos validos ' + list_like_plays.length);
      list_like_plays.forEach(function(item) {
        //console.log(objToString(item));
        console.log('finish one', item.textContent);
        //$(item).click();

        var clickElement = function (el){
            var ev = document.createEvent("MouseEvent");
            ev.initMouseEvent(
              "click",
              true /* bubble */, true /* cancelable */,
              window, null,
              0, 0, 0, 0, /* coordinates */
              false, false, false, false, /* modifier keys */
              0 /*left*/, null
            );
            el.dispatchEvent(ev);
        };
        console.log('before item click');

        item.addEventListener('click', function() {
            console.log('click');
        });
        // console.log('print ************');
        // console.log(objToString(item));;
        // console.log('print ************');
        $(item).children('[class="ipo-Fixture_GameDetail "]')[0].click()
        window.callPhantom({ exit: true });
        //clickElement(item);

        //setTimeout(function(){
          //  setInterval(function () {
              // console.log('luego del item click');
              //
              // var lista = $('[class="ml18-ScoreboardColumn "]');
              // console.log('length', lista.length);

              //console.log(objToString(lista[0]));


              $('[class="ml18-ScoreboardColumn "]').forEach(function(index, itemCuartos) {
                  console.log('dentro del puntaje ');
                  window.callPhantom({ exit: true });
                  var cuarto = parseInt($(itemCuartos).children('[class="ml18-ScoreboardHeaderCell "]').text()),
                    puntajes = $(itemCuartos).children('[class="ml18-ScoreboardCell "]'),
                    puntajeLeft = parseInt(puntajes[0].textContent),
                    puntajeRight = parseInt(puntajes[1].textContent);
                  console.log('dentro del puntaje cuarto:' + cuarto + ' puntajeLeft:' + puntajeLeft + ' puntajeRight: ' + puntajeRight);
                  if (cuarto == item.cuartoActual && Math.abs(puntajeLeft - puntajeRight) > 10) {
                    console.log(itemCuartos, cuarto, puntajeLeft, puntajeRight)
                    resultado += itemCuartos + ';' + cuarto + ';' + puntajeLeft + ';' + puntajeRight;
                    $('[class="ipe-Market "]').each(function(index, itemCuarto) {
                      var header = $(itemCuarto).find('[class="ipe-Market_ButtonText"]').text(),
                        names = $(itemCuarto).find('[class="ipe-Participant_OppName"]'),
                        values = $(itemCuarto).find('[class="ipe-Participant_OppOdds "]');
                      if (header.indexOf('Quarter - Winner (2-Way)') >= 0)
                        console.log(header, names[0].textContent, values[0].textContent, names[1].textContent, values[1].textContent)
                      resultado += header + ';' + names[0].textContent + ';' + values[0].textContent + ';' + names[1].textContent + ';' + values[1].textContent
                    })
                  }
                })
                //window.callPhantom({ exit: true });
            //}, 5000);
        //}, 1);
        //setTimeout(function() {

          //}, 2000)


      })

    });
    phantom.exit();
  }, 60000)

  //debugger
  // Do other things here...
};

page.onConsoleMessage = function(msg) {
  console.log(msg);
}

/*
page.onPageCreated = function(newPage) {
  page.render('example2.png');
}; */
