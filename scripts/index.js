var file = require("./file-get.js").fileGet();
var readlineSync = require("readline-sync");
var chalk = require("./console-colors.js");
var sailthruAPI = require("./sailthru-api.js");

if (file) {
  var adNew = require("./ad-new.js").init(file);
  var adSort = require("./ad-sort.js").init(file);
  var adMinify = require("./ad-minify.js").init(file);
  // console.log(file.data);


  setTimeout(function() {
    if (readlineSync.keyInYN(chalk.request("Push data to Sailthru?"))) {
      // Yes
      sailthruAPI.initPush(file);
    } else {
      // No or Other
      console.log(chalk.success("Okay, the file was not pushed."));
    }
  }, 200);
}
