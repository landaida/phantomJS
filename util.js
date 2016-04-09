
waitFor = function(testFx, onReady, timeOutMillis, showConsole) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 120000, //< Default Max Timout is 3s
    start = new Date().getTime(),
    condition = false,
    interval = setInterval(function() {
      try {
        if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
          // If not time-out yet and condition not yet fulfilled
          condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
        } else {
          if (!condition) {
            // If condition still not fulfilled (timeout but condition is 'false')
            console.log("'waitFor()' timeout");
              window.callPhantom({
                exit: true
              });
          } else {
            // Condition fulfilled (timeout and/or condition is 'true')
            // console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
            clearInterval(interval); //< Stop this interval
            typeof(onReady) === "string" ? eval(onReady): onReady(); //< Do what it's supposed to do once the condition is fulfilled
          }
        }
      } catch (e) {
        console.log('Error', err.message);
      }
    }, 250); //< repeat check every 250ms
};


function takeScreenShot(first_char) {
  var title = '', d = new Date();
  title += d.toLocaleTimeString().split(' ')[0].replace(/\:/g, ' ');
  title += first_char ? first_char : '';
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

function toDecimal(number){
  return parseFloat(number).toFixed(2)
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

function clickEvent(rect){
  window.callPhantom({
    sendEvent: true,
    rect:rect
  });
}
