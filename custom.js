"use strict";

function waitFor(testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 60000, //< Default Max Timout is 3s
    start = new Date().getTime(),
    condition = false,
    interval = setInterval(function() {
      if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
        // If not time-out yet and condition not yet fulfilled
        condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
      } else {
        if (!condition) {
          // If condition still not fulfilled (timeout but condition is 'false')
          console.log("'waitFor()' timeout");
          phantom.exit(1);
        } else {
          // Condition fulfilled (timeout and/or condition is 'true')
          // console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
          typeof(onReady) === "string" ? eval(onReady): onReady(); //< Do what it's supposed to do once the condition is fulfilled
          clearInterval(interval); //< Stop this interval
        }
      }
    }, 250); //< repeat check every 250ms
};


var page = require('webpage').create();

//para finger que es un movil
page.settings.userAgent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36';
page.settings.javascriptEnabled = true;

//set browser en ingles
page.customHeaders = {
  "Accept-Language": "en-US"
};

// page.onResourceReceived = function(response) {
//     if (response.stage !== "end") return;
//     console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + response.url);
// };
// page.onResourceRequested = function(requestData, networkRequest) {
//     console.log('Request (#' + requestData.id + '): ' + requestData.url);
// };
page.onUrlChanged = function(targetUrl) {
  // console.log('New URL: ' + targetUrl);
};
page.onLoadFinished = function(status) {
  // console.log('Load Finished: ' + status);
};
// console.log('Load Started');
page.onLoadStarted = function() {};
page.onNavigationRequested = function(url, type, willNavigate, main) {
  // console.log('Trying to navigate to: ' + url);
};


page.open('https://mobile.bet365.com/#type=InPlay;key=18;ip=1;lng=1', function(status) {
  //console.log('status:', status);
  if (status === "success") {
    // console.log("Exito al abrir pagina.");
    // console.log('Status finish: ' + status);

    // Wait for 'signin-dropdown' to be visible
    waitFor(function() {
      // Check in the page if a specific element is now visible
      return page.evaluate(function() {
        var in_live_play_list = $(".ipo-Fixture.ipo-Fixture_TimedFixture"),
          length = 0;
        if (in_live_play_list && in_live_play_list.length)
          length = in_live_play_list.length;
        //console.log(length);
        return length > 0;
      });
    }, function() {

      //page.evaluate(function() {
      page.evaluateAsync(function() {
        function waitFor(testFx, onReady, timeOutMillis) {
          debugger;
          // console.log('inside waitFor');
          var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 60000, //< Default Max Timout is 3s
            start = new Date().getTime(),
            condition = false,
            interval = window.setInterval(function() {
              if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
              } else {
                if (!condition) {
                  // If condition still not fulfilled (timeout but condition is 'false')
                  console.log("'waitFor()' timeout");
                  my_exit()
                } else {
                  // Condition fulfilled (timeout and/or condition is 'true')
                  //console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                  typeof(onReady) === "string" ? eval(onReady): onReady(); //< Do what it's supposed to do once the condition is fulfilled
                  clearInterval(interval); //< Stop this interval
                }
              }
            }, 250); //< repeat check every 250ms
            //console.log('after var declar', maxtimeOutMillis, start, condition, interval);
        };

        String.prototype.replaceAll = function(search, replacement) {
          var target = this;
          return target.replace(new RegExp(search, 'g'), replacement);
        };

        function getTimeToString() {
          var d = new Date();
          return d.toLocaleTimeString().split(' ')[0].replaceAll(':', '');
        }

        function takeScreenShot(first_char) {
          var title = first_char ? first_char : '';
          title += getTimeToString();
          window.callPhantom({
            render: true,
            title: title
          });
        }

        function my_exit() {
          window.callPhantom({
            exit: true
          });
        }

        function fractionToDecimal(number){
          return parseFloat(eval(number)).toFixed(2)
        }

        function objToString(obj) {
          var str = '';
          for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
              str += p + '::' + obj[p] + '\n';
            }
          }
          return str;
        }

        var list_like_plays = [];
        //retrieve times of basketball live-inPlay
        $(".ipo-Fixture.ipo-Fixture_TimedFixture").each(function(index, item) {
            var tiempo = $(item).find("[class='ipo-Fixture_GameInfo ']").text(),
              minuto = parseInt(tiempo.split(':')[0]),
              cuarto = $(item).find(".ipo-Fixture_GameInfo.ipo-Fixture_GameInfo-2").text();
            //console.log('minuto:' + minuto + '\n')
            //console.log('cuarto: ' + cuarto + '\n')
            if (minuto <= 12 && minuto > 1 && cuarto.length < 3) {
              var cuartoActual = parseInt(cuarto.substring(1))
              item.tiempo = tiempo;
              item.cuartoActual = cuartoActual;
              list_like_plays.push(item);
            }
          })
          //console.log('lista: ', list_like_plays[0].textContent)

        console.log('lista de juegos candidatos ' + list_like_plays.length);

        if (list_like_plays.length == 0)
          my_exit();

        var i = 0;
        (function callAllInPlayGames() {
          console.log('i= ' + i + ' ' +list_like_plays[i].textContent + '\n');
          findInLiveInfoAndOdds(list_like_plays[i], function() {
            debugger;
            console.log(window.location);
            window.history.back();
            takeScreenShot('afterback');
            waitFor(function(){
              var lista_to_find = $(".ipo-Fixture.ipo-Fixture_TimedFixture"), length = 0;
              if (lista_to_find && lista_to_find.length)
                length = lista_to_find.length;
                console.log(window.location);
                console.log(lista_to_find[0].textContent);
                console.log(length);
              return length > 0;
            },function(){
              i++;
              console.log('inside onReady i=' + i + ' ', $(".ipo-Fixture.ipo-Fixture_TimedFixture").length);
              takeScreenShot('ready')
              if (i < list_like_plays.length) {
                callAllInPlayGames();
              } else {
                my_exit();
              }
            })
          });
        })()

        function findInLiveInfoAndOdds(item, callback) {
          try {
            debugger;
            // console.log(item.textContent);
            // console.log('before click ', $(item).children('[class="ipo-Fixture_GameDetail "]').text());
            item.addEventListener('click', function() {
                console.log('click');
            });
            //abre el detalle de cada juego deseado
            console.log(window.location);
            // $(item).children('[class="ipo-Fixture_GameDetail "]')[0].click();
            $(item).click();
            //console.log($(item).textContent);
            console.log(window.location);
            console.log('after onReady');
            takeScreenShot('afterReady')
            waitFor(function() {
              debugger;
              // Check in the page if a specific element is now visible
              var in_live_play_scoreds_list = $(".ipe-EventViewTitle "),
                length = 0;
              if (in_live_play_scoreds_list && in_live_play_scoreds_list.length)
                length = in_live_play_scoreds_list.length;
                // console.log('waitFor two', length, $(".ipe-EventViewTitle ")[0].textContent);
              return length > 0;

            }, function() {
              debugger;
              //como es mobile el scoreBoard no esta visible
              $(".ml18-TabController_Tab.ml18-TabController_Tab-Scoreboard")[0].click()
              waitFor(function(){
                debugger;
                var lista_to_find = $(".ml18-ScoreboardCell "), length = 0;
                if (lista_to_find && lista_to_find.length)
                  length = lista_to_find.length;
                  console.log('waitFor three', length, $(".ml18-ScoreboardCell ")[0].textContent);
                return length > 0;
              }, function() {
                try {
                  debugger;
                  console.log('afterThree');
                  takeScreenShot('afterThree')
                  //console.log('search: ', '[class="ml18-ScoreboardHeaderCell "]:contains("'+item.cuartoActual+'")');
                  var puntajes = $('[class="ml18-ScoreboardHeaderCell "]:contains("' + item.cuartoActual + '")').parent().children('[class="ml18-ScoreboardCell "]');
                  //console.log(puntajes.text());
                  var puntajeLeft = parseInt(puntajes[0].textContent);
                  //console.log('puntajeLeft: ', puntajeLeft);
                  var puntajeRight = parseInt(puntajes[1].textContent);
                  //console.log('puntajeRight: ', puntajeRight);
                  var equiposNombres = $('[class="ipe-Market_ButtonText"]:contains("Quarter - Winner (2-Way)")').parent().parent().find('[class="ipe-Participant_OppName"]');
                  var equiposValor = $('[class="ipe-Market_ButtonText"]:contains("Quarter - Winner (2-Way)")').parent().parent().find('[class="ipe-Participant_OppOdds "]');
                  // console.log(puntajeLeft, puntajeRight)
                  if (Math.abs(puntajeLeft - puntajeRight) > 6) {
                    console.log('Candidato    óptimo('+ item.tiempo +'): ' + equiposNombres[0].textContent + '(' + puntajeLeft + ') bet: ' + fractionToDecimal(equiposValor[0].textContent) + '   ' + equiposNombres[1].textContent + '(' + puntajeRight + '): ' + fractionToDecimal(equiposValor[1].textContent));
                  } else {
                    console.log('Candidato NO óptimo('+ item.tiempo +'): ' + equiposNombres[0].textContent + '(' + puntajeLeft + ') bet: ' + fractionToDecimal(equiposValor[0].textContent) + '   ' + equiposNombres[1].textContent + '(' + puntajeRight + '): ' + fractionToDecimal(equiposValor[1].textContent));
                  }
                  callback();
              } catch (err) {
                  console.log('Error', err.message);
                  callback();
               }
              })
            })
          } catch (err) {
            console.log('Error', err.message);
            callback();
           }
        } //function findInLiveInfoAndOdds

        // setTimeout(function() {
        // }, TIMER_LOAD_PAGE)
      })
    });
  } else {
    console.log("Error al abrir pagina.");
  }
});

//cuando llamo exit desde el evaluate
page.onCallback = function(data) {
  if (data && data.render) {
    page.render('img/' + data.title + '.png');
  }
  if (data && data.exit) {
    console.log('god bye!');
    phantom.exit();
  }
};

page.onConsoleMessage = function(msg) {
  console.log(msg);
}
