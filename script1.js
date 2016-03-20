"use strict";

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
    console.log('New URL: ' + targetUrl);
};
page.onLoadFinished = function(status) {
    console.log('Load Finished: ' + status);
};
page.onLoadStarted = function() {
    console.log('Load Started');
};
page.onNavigationRequested = function(url, type, willNavigate, main) {
    console.log('Trying to navigate to: ' + url);
};


page.open('https://mobile.bet365.com/#type=InPlay;key=18;ip=1;lng=1', function(status) {
    console.log('status:', status);
    if (status === "success") {
      console.log("Exito al abrir pagina.");
      console.log('Status finish: ' + status);
      page.render('example3.png');
      page.evaluate(function(){

        function findInLiveInfoAndOdds(item, callback){
          window.callPhantom({render: true, title: 'one'});
          // console.log(item.textContent);
          // item.addEventListener('click', function() {
          //     console.log('click');
          // });
          //abre el detalle de cada juego deseado
          $(item).children('[class="ipo-Fixture_GameDetail "]')[0].click();
          setTimeout(function(){
            //como es mobile el scoreBoard no esta visible
            $(".ml18-TabController_Tab.ml18-TabController_Tab-Scoreboard")[0].click()
            //console.log('search: ', '[class="ml18-ScoreboardHeaderCell "]:contains("'+item.cuartoActual+'")');
            var puntajes = $('[class="ml18-ScoreboardHeaderCell "]:contains("'+item.cuartoActual+'")').parent().children('[class="ml18-ScoreboardCell "]');
            //console.log(puntajes.text());
            var puntajeLeft = parseInt(puntajes[0].textContent);
            console.log('puntajeLeft: ', puntajeLeft);
            var puntajeRight = parseInt(puntajes[1].textContent);
            console.log('puntajeRight: ', puntajeRight);

            if (Math.abs(puntajeLeft - puntajeRight) > 10) {
              // console.log(puntajeLeft, puntajeRight)
              var equiposNombres = $('[class="ipe-Market_ButtonText"]:contains("Quarter - Winner (2-Way)")').parent().parent().find('[class="ipe-Participant_OppName"]');
              var equiposValor = $('[class="ipe-Market_ButtonText"]:contains("Quarter - Winner (2-Way)")').parent().parent().find('[class="ipe-Participant_OppOdds "]');
              window.callPhantom({render: true, title: new Date()});
              console.log(equiposNombres[0].textContent + ': ' + eval(equiposValor[0].textContent) + ' ' + equiposNombres[1].textContent + ': ' + eval(equiposValor[1].textContent));
            }
            callback();
          }, 8000)
        }

        setTimeout(function() {
          var list_like_plays = [];

          //retrieve times of basketball live-inPlay
          $(".ipo-Fixture.ipo-Fixture_TimedFixture").each(function(index, item) {
            var div = $(item).find("[class='ipo-Fixture_GameInfo ']").text(),
              minuto = parseInt(div.split(':')[0]),
              cuarto = $(item).find(".ipo-Fixture_GameInfo.ipo-Fixture_GameInfo-2").text();
            //console.log('minuto:' + minuto + '\n')
            //console.log('cuarto: ' + cuarto + '\n')
            if (minuto <= 8 && minuto > 2 && cuarto.length < 3) {
              var cuartoActual = parseInt(cuarto.substring(1))
              item.cuartoActual = cuartoActual;
              list_like_plays.push(item);
            }
          })
          //console.log('lista: ', list_like_plays[0].textContent)
          window.callPhantom({render: true, title: 'default'});

          console.log('lista de juegos validos ' + list_like_plays.length);

          if(list_like_plays.length == 0)
                phantom.exit()

          var i = 0;
          (function callAllInPlayGames(){
              findInLiveInfoAndOdds(list_like_plays[i], function(){
                console.log('call callback i:', i, ' ', list_like_plays[i].textContent);
                if(i<list_like_plays.length){
                  i++;
                  callAllInPlayGames();
                }else{
                  phantom.exit()
                }
              });
              phantom.exit()
          })()
          phantom.exit()
        }, 8000)
      })
    } else {
      console.log("Error al abrir pagina.");
    }
});

//cuando llamo exit desde el evaluate
page.onCallback = function(data) {
  if (data && data.render) {
    page.render(data.title+'.png');
  }
};

page.onConsoleMessage = function(msg) {
  console.log(msg);
}
