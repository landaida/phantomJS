"use strict";
var isLogged = false;
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
  isLogged = true;
  // console.log('Load Finished: ' + status);
};
// console.log('Load Started');
page.onLoadStarted = function() {
  // console.log('onLoadStarted');
};
page.onNavigationRequested = function(url, type, willNavigate, main) {
  // console.log('Trying to navigate to: ' + url);
};
page.onResourceError = function(resourceError) {
  // console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
  // console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
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


var system = require('system');
// process args
var args = system.args;

// these args will be processed
var argsApplicable = ['--page-url', '--user-name', '--password'];
// populated with the valid args provided in availableArgs but like argsValid.test_id

var p_url = '', p_login= '', p_password= '';
if (args.length === 1) {
  console.log('Try to pass some arguments when invoking this script!');
} else {
  args.forEach(function(arg, i) {
    // skip first arg which is script name
    if(i != 0) {
      var bits = arg.split('==');
      //console.log(i + ': ' + arg);
      if(bits.length !=2) {
        console.log('Arguement has wrong format: '+arg);
      }
        var argVar = bits[0].replace(/\-/g, '_');
        argVar = argVar.replace(/__/, '');
        if(argVar == "url"){
          p_url = bits[1];
        }else if(argVar == "login"){
          p_login = bits[1];
        }else if(argVar == "password"){
          p_password = bits[1];
        }
    }
  });
}


page.open(p_url, function(status) {
  if (status === "success") {
    console.log("Exito al abrir pagina.");
    if (phantom.injectJs('util.js')) {

      page.evaluate(function() {
        try {
          var waitFor = arguments[0],
            my_exit = arguments[1],
            takeScreenShot = arguments[2],
            toDecimal = arguments[3],
            objToString = arguments[4],
            p_login = arguments[5],
            p_password = arguments[6],
            isLogged = arguments[7];

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
                $('.hm-LoginPrompt_Input.hm-Login_InputUsername').val(p_login);
                $('.hm-LoginPrompt_Input.hm-Login_InputPassword').val(p_password);
                $('[data-nav="LogInUserFromPopUp"]').click();
              })
            }, 60000)
        } catch (e) {
          console.log('Error', err.message);
          my_exit();
        }
      }, waitFor, my_exit, takeScreenShot, toDecimal, objToString, p_login, p_password, isLogged);

        //debo esperar porque recarga la pagina

        isLogged = false;
        waitFor(function(){
          return isLogged;
        },function(){
          page.evaluate(function() {
            try {
              var waitFor = arguments[0],
                my_exit = arguments[1],
                takeScreenShot = arguments[2],
                toDecimal = arguments[3],
                objToString = arguments[4],
                isLogged = arguments[5]
                ;
                  waitFor(function() {
                    var sought = $(".hm-WideHeaderPod_Icon "),
                    length = 0;
                    if (sought && sought.length)
                    length = sought.length;
                    return length > 0;
                  }, function() {
                    waitFor(function() {
                      var sought = $(".ipo-Fixture.ipo-Fixture_TimedFixture"),
                      length = 0;
                      if (sought && sought.length)
                      length = sought.length;
                      return length > 0;
                    }, function() {
                      (function search_in_live_play(){
                        //$('[data-nav="Preferences"]').click()

                        //retrieve times of basketball live-inPlay
                        var i = 0, lista = $(".ipo-Fixture.ipo-Fixture_TimedFixture");
                        // lista.each(function(index, item) {

                        (function callAllInPlayGames() {
                          findInLiveInfoAndOdds(lista[i], function() {
                            if($(".ipo-Fixture.ipo-Fixture_TimedFixture").length == 0)
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
                                setTimeout(function(){
                                  search_in_live_play();
                                }, 60000)
                              }
                            })
                          });
                        })()

                        function findInLiveInfoAndOdds(item, callback) {
                          var tiempo = $(item).find("[class='ipo-Fixture_GameInfo ']").text(),
                          minuto = parseInt(tiempo.split(':')[0]),
                          cuarto = $(item).find(".ipo-Fixture_GameInfo.ipo-Fixture_GameInfo-2").text();
                          //console.log('minuto:' + minuto + '\n')
                          //console.log('cuarto: ' + cuarto + '\n')
                          if (minuto <= 5 && minuto > 2 && cuarto.length < 3) {
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
                                    // var betsValue = $('[class="ipe-Market_ButtonText"]:contains("Quarter - Winner (2-Way)")').parent().parent().find('[class="ipe-Participant "]'),
                                    // betsValueLeft = toDecimal(betsValue[0].textContent), betsValueRight = toDecimal(betsValue[1].textContent);
                                    var equiposNombres = $('[class="ipe-Market_ButtonText"]:contains("Quarter - Winner (2-Way)")').parent().parent().find('[class="ipe-Participant_OppName"]');
                                    var equiposValor = $('[class="ipe-Market_ButtonText"]:contains("Quarter - Winner (2-Way)")').parent().parent().find('[class="ipe-Participant_OppOdds "]');
                                    var diferencia = Math.abs(puntajeLeft - puntajeRight);
                                    if (diferencia >= 10) {
                                      console.log('Candidato    óptimo(' + item.tiempo + '): *'+ diferencia + '* ' + equiposNombres[0].textContent + '(' + puntajeLeft + ') bet: ' + toDecimal(equiposValor[0].textContent) + '   ' + equiposNombres[1].textContent + '(' + puntajeRight + '): ' + toDecimal(equiposValor[1].textContent));
                                    } else {
                                      console.log('Candidato NO óptimo(' + item.tiempo + '): *'+ diferencia + '* ' + equiposNombres[0].textContent + '(' + puntajeLeft + ') bet: ' + toDecimal(equiposValor[0].textContent) + '   ' + equiposNombres[1].textContent + '(' + puntajeRight + '): ' + toDecimal(equiposValor[1].textContent));
                                    }
                                    // if(betsValueLeft > betsValueRight){
                                    //   betsValue[1].click();
                                    // }else {
                                    //   betsValue[0].click();
                                    // }
                                    // takeScreenShot('afterClick')
                                  }
                                  callback();
                                } catch (e) {
                                  console.log('Error', err.message);
                                  callback();
                                }
                              })
                            }, 20000)
                          }else{
                            //console.log('No es un Candidato: ', item.textContent, 'minuto:' + minuto, 'cuarto: ' + cuarto);
                            callback();
                          }
                        }
                      })()
                    }, 60000)
                  }, 120000)
            } catch (e) {
              console.log('Error', err.message);
              my_exit();
            }
          }, waitFor, my_exit, takeScreenShot, toDecimal, objToString, isLogged);
        }, 60000)
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
