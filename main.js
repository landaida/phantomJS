"use strict";
var isLogged = false;
var page = require('webpage').create();

//para finger que es un movil
// page.settings.userAgent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36';
//page.settings.userAgent = 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36';
// page.settings.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36';
// page.settings.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11";
// page.settings.userAgent = "Mozilla/5.0 (Linux; U; Android 2.2.1; en-ca; LG-P505R Build/FRG83) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1";
// page.settings.userAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36";
// page.settings.userAgent = "Mozilla/5.0 (X11; CrOS x86_64 6310.68.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.96 Safari/537.36";
page.settings.javascriptEnabled = true;

//set browser en ingles
page.customHeaders = {
  "Accept-Language": "en-US"
};

page.viewportSize = {
  width: 1366,
  height: 768
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

  // var msgStack = ['ERROR: ' + msg];
  //
  // if (trace && trace.length) {
  //   msgStack.push('TRACE:');
  //   trace.forEach(function(t) {
  //     msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function+'")' : ''));
  //   });
  // }
  //
  // console.error(msgStack.join('\n'));

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
    debugger
    console.log("Exito al abrir pagina.");
    if (phantom.injectJs('util.js')) {
      debugger
      // page.render('teste.png')
      page.evaluateAsync(function() {
      // page.evaluate(function() {
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
          page.evaluateAsync(function() {
          // page.evaluate(function() {
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
                                // setTimeout(function(){
                                //   var i = 0, lista = $(".ipo-Fixture.ipo-Fixture_TimedFixture");
                                //   search_in_live_play(i, lista);
                                // }, 60000)
                                var searching = true;
                                do {
                                  var sought = $(".ipo-Fixture.ipo-Fixture_TimedFixture"), length = 0;
                                  if (sought && sought.length)
                                  length = sought.length;
                                  if(length > 0){
                                    searching = false;
                                    search_in_live_play();
                                  }
                                } while (searching);
                              }
                            })
                          });

                        })()

                        function click(el){
                            console.log(el);
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
                            console.log('after dispatchEvent');
                        }

                        function findInLiveInfoAndOdds(item, callback) {
                          var tiempo = $(item).find("[class='ipo-Fixture_GameInfo ']").text(),
                          minuto = parseInt(tiempo.split(':')[0]),
                          cuarto = $(item).find(".ipo-Fixture_GameInfo.ipo-Fixture_GameInfo-2").text();
                          //console.log('minuto:' + minuto + '\n')
                          //console.log('cuarto: ' + cuarto + '\n')
                          if (minuto <= 9 && minuto >= 2 && cuarto.length < 3) {
                            var cuartoActual = parseInt(cuarto.substring(1))
                            item.tiempo = tiempo;
                            item.cuartoActual = cuartoActual;
                            $(item).click();
                            takeScreenShot()
                            // console.log(item.textContent);
                            waitFor(function() {
                              var sought = $(".ml18-MatchLiveBasketballModule_MatchLiveWrapper "),
                                  sought2 = $('.v5.MarketGrid.ipe-MarketGrid_Classification-18 '),
                              length = 0;
                              if (sought && sought.length && sought2 && sought2.length)
                              length = sought.length;
                              takeScreenShot('waiting')
                              return length > 0;
                            }, function() {
                              takeScreenShot('afterFirstWait')
                              $(".ml18-MatchLiveBasketballModule_AnimWrapper ")[0].click()
                              // $(".ml18-TabController_Tab.ml18-TabController_Tab-Scoreboard")[0].click()
                              waitFor(function() {
                                var sought = $(".ml18-ScoreboardCell "),
                                length = 0;
                                if (sought && sought.length)
                                length = sought.length;
                                takeScreenShot('insdideSecondWait')
                                return length > 0;
                              }, function() {
                                try {
                                  takeScreenShot('afterSecondWait')
                                  //Si ya no existe o no esta suspendido pasa al otro
                                  if(!$('[class="ipe-Market_ButtonText"]:contains("Quarter - Winner (2-Way)")') || $('#MarketGrid > .ipe-Market_Suspended').length > 0){
                                     callback();
                                  }else {
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
                                      var horario = new Date();
                                      horario = horario.toLocaleTimeString().split(' ')[0];
                                      takeScreenShot('beforeClickPlay')
                                      debugger
                                      if(parseFloat($('.hm-WideHeaderPod_UserBalance ').text()) >= 5 ){
                                        takeScreenShot('exists money')
                                        if(parseFloat(equiposValor[0].textContent) > parseFloat(equiposValor[1].textContent)){
                                          equiposValor[1].click();
                                        }else {
                                          equiposValor[0].click();
                                        }
                                        // takeScreenShot('afterClickBet')
                                        // takeScreenShot('afterClickBet')
                                        // takeScreenShot('afterClickBet')
                                        // $('#betslipBarEnhanced').click()
                                        // takeScreenShot('afterClickToContainer')
                                        // takeScreenShot('afterClickToContainer')
                                        // takeScreenShot('afterClickToContainer')
                                          waitFor(function(){
                                            var sought = $('[data-inp-type="sngstk"]'),
                                            length = 0;
                                            if (sought && sought.length)
                                            length = sought.length;
                                            takeScreenShot('waitForContainer')
                                            return length > 0;
                                          },function(){
                                            $('[data-inp-type="sngstk"]').val(0.5)
                                            $('[data-inp-type="sngstk"]').blur()
                                            takeScreenShot('setValue');
                                            waitFor(function(){
                                              var sought = $('.acceptChanges.abetslipBtn > button'), sought2 = $('.acceptChanges.abetslipBtn.hidden'),
                                              length = 0;
                                              if ((sought && sought.length) || (sought2 && sought2.length))
                                              length = sought.length;
                                              return length > 0;
                                            }, function(){
                                              if(!$('.acceptChanges.abetslipBtn.hidden'))
                                                // $('.acceptChanges.abetslipBtn > button').click()
                                                console.log('acceptChanges ', $('.acceptChanges.abetslipBtn > button').trigger( "click" ));
                                                debugger
                                              waitFor(function(){
                                                var sought = $('.placeBet.abetslipBtn > button'),
                                                length = 0;
                                                if (sought && sought.length)
                                                length = sought.length;
                                                takeScreenShot('placeBetWai');
                                                return length > 0;
                                              }, function(){
                                                // $('.placeBet.abetslipBtn > button').click()
                                                debugger
                                                // console.log('placeBetWait ', $('.placeBet.abetslipBtn > button').trigger( "click" ));
                                                click($('.placeBet.abetslipBtn > button'));
                                                takeScreenShot('placeBetClick');
                                                waitFor(function(){
                                                  var sought = $('.abetslipRecBtn > button'),
                                                  length = 0;
                                                  if (sought && sought.length)
                                                  length = sought.length;
                                                  takeScreenShot('continueButonWait');
                                                  return length > 0;
                                                }, function(){
                                                  $('.abetslipRecBtn > button').click()
                                                  takeScreenShot('continueButonClick');
                                                });
                                              });
                                            });

                                        })
                                      }
                                      if (diferencia >= 10) {
                                        console.log(horario + ';;1;;' + item.tiempo + ';;'+ diferencia + ';;' + equiposNombres[0].textContent + ';;' + puntajeLeft + ';;' + toDecimal(equiposValor[0].textContent) + ';;' + equiposNombres[1].textContent + ';;' + puntajeRight + ';;' + toDecimal(equiposValor[1].textContent) + ';;' + item.cuartoActual);
                                      } else if (diferencia >= 8 && diferencia <= 9) {
                                        console.log(horario + ';;0;;' + item.tiempo + ';;'+ diferencia + ';;' + equiposNombres[0].textContent + ';;' + puntajeLeft + ';;' + toDecimal(equiposValor[0].textContent) + ';;' + equiposNombres[1].textContent + ';;' + puntajeRight + ';;' + toDecimal(equiposValor[1].textContent) + ';;' + item.cuartoActual);
                                      }
                                      // if(betsValueLeft > betsValueRight){
                                      //   betsValue[1].click();
                                      // }else {
                                      //   betsValue[0].click();
                                      // }
                                      // takeScreenShot('afterClick')
                                    }
                                    callback();
                                  }
                                } catch (e) {
                                  console.log('Error', err.message);
                                  callback();
                                }
                              })
                            }, 60000)
                          }else{
                            console.log('No es un Candidato: ', item.textContent, 'minuto:' + minuto, 'cuarto: ' + cuarto);
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
    page.render(data.title + '.png');
  }
  if (data && data.exit) {
    console.log('god bye!');
    phantom.exit();
  }
};
