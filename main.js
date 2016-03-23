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
  // console.log('New URL: ' + targetUrl);
};
page.onLoadFinished = function(status) {
  // console.log('Load Finished: ' + status);
};
// console.log('Load Started');
page.onLoadStarted = function() {
  // console.log('onLoadStarted');
};
page.onNavigationRequested = function(url, type, willNavigate, main) {
  // console.log('Trying to navigate to: ' + url);
};

page.onError = function(msg, trace) {

  var msgStack = ['ERROR: ' + msg];

  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function+'")' : ''));
    });
  }

  console.error(msgStack.join('\n'));

};

page.open('https://mobile.bet365.com/#type=InPlay;key=18;ip=1;lng=1', function(status) {
  if (status === "success") {
    console.log("Exito al abrir pagina.");
    if (phantom.injectJs('util.js')) {
      page.evaluate(function() {
        try {
          var waitFor = arguments[0],
            my_exit = arguments[1],
            takeScreenShot = arguments[2],
            fractionToDecimal = arguments[3],
            objToString = arguments[4];

            waitFor(function() {
              var sought = $(".ipo-Fixture.ipo-Fixture_TimedFixture"),
              length = 0;
              if (sought && sought.length)
              length = sought.length;
              return length > 0;
            }, function() {
              $('.hm-WideHeaderPod_Login ').click();
              waitFor(function(){
                var sought = $('.hm-LoginPrompt_Input.hm-Login_InputUsername'),
                length = 0;
                if (sought && sought.length)
                length = sought.length;
                if(length > 0)
                return length > 0;
              }, function(){
                $('.hm-LoginPrompt_Input.hm-Login_InputUsername').val('user');
                $('.hm-LoginPrompt_Input.hm-Login_InputPassword').val('password');
                $('[data-nav="LogInUserFromPopUp"]').click();
              })
            }, 60000)
        } catch (e) {
          console.log('Error', err.message);
          my_exit();
        }
      }, waitFor, my_exit, takeScreenShot, fractionToDecimal, objToString);

      //debo esperar porque recarga la pagina
      setTimeout(function(){
        page.evaluate(function() {
          try {
            var waitFor = arguments[0],
              my_exit = arguments[1],
              takeScreenShot = arguments[2],
              fractionToDecimal = arguments[3],
              objToString = arguments[4];
                waitFor(function() {
                  var sought = $(".hm-WideHeaderPod_Icon "),
                  length = 0;
                  if (sought && sought.length)
                  length = sought.length;
                  return length > 0;
                  takeScreenShot('waitingForLogin')
                }, function() {
                  takeScreenShot('after login')
                  waitFor(function() {
                    var sought = $(".ipo-Fixture.ipo-Fixture_TimedFixture"),
                    length = 0;
                    if (sought && sought.length)
                    length = sought.length;
                    takeScreenShot('waiting')
                    return length > 0;
                  }, function() {
                    takeScreenShot('searchPlay')
                    //$('[data-nav="Preferences"]').click()

                    //retrieve times of basketball live-inPlay
                    var i = 0, lista = $(".ipo-Fixture.ipo-Fixture_TimedFixture");
                    // lista.each(function(index, item) {

                    (function callAllInPlayGames() {
                      findInLiveInfoAndOdds(lista[i], function() {
                        window.history.back();
                        waitFor(function(){
                          var sought = $(".ipo-Fixture.ipo-Fixture_TimedFixture"), length = 0;
                          if (sought && sought.length)
                          length = sought.length;
                          return length > 0;
                        },function(){
                          lista = $(".ipo-Fixture.ipo-Fixture_TimedFixture")
                          i++;
                          if (i < lista.length) {
                            callAllInPlayGames();
                          } else {
                            my_exit();
                          }
                        })
                      });
                    })()

                    function findInLiveInfoAndOdds(item, callback) {
                      var tiempo = $(item).find("[class='ipo-Fixture_GameInfo ']").text(),
                      minuto = parseInt(tiempo.split(':')[0]),
                      cuarto = $(item).find(".ipo-Fixture_GameInfo.ipo-Fixture_GameInfo-2").text();
                      takeScreenShot()
                      //console.log('minuto:' + minuto + '\n')
                      //console.log('cuarto: ' + cuarto + '\n')
                      if (minuto <= 12 && minuto > 1 && cuarto.length < 3) {
                        var cuartoActual = parseInt(cuarto.substring(1))
                        item.tiempo = tiempo;
                        item.cuartoActual = cuartoActual;
                        $(item).click();
                        // console.log(item.textContent);
                        waitFor(function() {
                          var sought = $(".ml18-MatchLiveBasketballModule_MatchLiveWrapper "),
                          length = 0;
                          if (sought && sought.length)
                          length = sought.length;
                          return length > 0;
                        }, function() {
                          $(".ml18-MatchLiveBasketballModule_AnimWrapper ")[0].click()
                          $(".ml18-TabController_Tab.ml18-TabController_Tab-Scoreboard")[0].click()
                          waitFor(function() {
                            var sought = $(".ml18-ScoreboardCell "),
                            length = 0;
                            if (sought && sought.length)
                            length = sought.length;
                            return length > 0;
                          }, function() {
                            try {
                              takeScreenShot()
                              //console.log('search: ', '[class="ml18-ScoreboardHeaderCell "]:contains("'+item.cuartoActual+'")');
                              var puntajes = $('[class="ml18-ScoreboardHeaderCell "]:contains("' + item.cuartoActual + '")').parent().children('[class="ml18-ScoreboardCell "]');
                              //console.log(puntajes.text());
                              var puntajeLeft = parseInt(puntajes[0].textContent);
                              // console.log('puntajeLeft: ', puntajeLeft);
                              var puntajeRight = parseInt(puntajes[1].textContent);
                              // console.log('puntajeRight: ', puntajeRight);
                              var isExist = $('[class="ipe-Market_ButtonText"]:contains("Quarter - Winner (2-Way)")').parent().parent().find('[class="ipe-Participant_OppName"]'),
                              isExist1 = $('[class="ipe-Market_ButtonText"]:contains("Quarter - Winner (2-Way)")').parent().parent().find('[class="ipe-Participant_OppOdds "]');
                              if (isExist.length > 0 && isExist1.length) {
                                var equiposNombres = $('[class="ipe-Market_ButtonText"]:contains("Quarter - Winner (2-Way)")').parent().parent().find('[class="ipe-Participant_OppName"]');
                                var equiposValor = $('[class="ipe-Market_ButtonText"]:contains("Quarter - Winner (2-Way)")').parent().parent().find('[class="ipe-Participant_OppOdds "]');
                                if (Math.abs(puntajeLeft - puntajeRight) > 6) {
                                  console.log('Candidato    óptimo(' + item.tiempo + '): ' + equiposNombres[0].textContent + '(' + puntajeLeft + ') bet: ' + fractionToDecimal(equiposValor[0].textContent) + '   ' + equiposNombres[1].textContent + '(' + puntajeRight + '): ' + fractionToDecimal(equiposValor[1].textContent));
                                } else {
                                  console.log('Candidato NO óptimo(' + item.tiempo + '): ' + equiposNombres[0].textContent + '(' + puntajeLeft + ') bet: ' + fractionToDecimal(equiposValor[0].textContent) + '   ' + equiposNombres[1].textContent + '(' + puntajeRight + '): ' + fractionToDecimal(equiposValor[1].textContent));
                                }
                              }
                              callback();
                            } catch (e) {
                              console.log('Error', err.message);
                              callback();
                            }
                          })
                        }, 20000)
                      }else{
                        console.log('No es un Candidato: ', item.textContent, 'minuto:' + minuto, 'cuarto: ' + cuarto);
                        callback();
                      }
                    }
                    // })
                  }, 60000)
                }, 120000)
          } catch (e) {
            console.log('Error', err.message);
            my_exit();
          }
        }, waitFor, my_exit, takeScreenShot, fractionToDecimal, objToString);
      },8000)
    } else {
      console.log('error to load util.js');
    }
  }
});


page.onConsoleMessage = function(msg) {
  console.log(msg);
}

page.onCallback = function(data) {
  if (data && data.render) {
    page.render('img/' + data.title + '.png');
  }
  if (data && data.exit) {
    console.log('god bye!');
    phantom.exit();
  }
};
