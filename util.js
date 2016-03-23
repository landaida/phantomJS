
waitFor = function(testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 5000, //< Default Max Timout is 3s
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
          if(phantom)
            phantom.exit(1);
          else if(my_exit){
            window.callPhantom({
              exit: true
            });
          }
        } else {
          // Condition fulfilled (timeout and/or condition is 'true')
          // console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
          clearInterval(interval); //< Stop this interval
          typeof(onReady) === "string" ? eval(onReady): onReady(); //< Do what it's supposed to do once the condition is fulfilled
        }
      }
    }, 250); //< repeat check every 250ms
};


function takeScreenShot(first_char) {
  var title = first_char ? first_char : '', d = new Date();
  title += d.toLocaleTimeString().split(' ')[0].replace(/\:/g, ' ');
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
