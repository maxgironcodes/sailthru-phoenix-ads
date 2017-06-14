var file = require("./file-get.js").fileGet();
var readlineSync = require("readline-sync");
var chalk = require("./console-colors.js");
var sailthruAPI = require("./sailthru-api.js");

if (file) {
  var adNew = require("./ad-new.js");
  var newEntry = adNew.init(file);

  if (newEntry) {
    var adSort = require("./ad-sort.js").init(file);
    var adMinify = require("./ad-minify.js").init(file);

    setTimeout(function () {
      getOptions();
    }, 200);
  }
}

function getOptions() {
  var options = {};
  options.sailthru_push = readlineSync.keyInYNStrict(chalk.request("Push data to Sailthru?"));
  options.sailthru_test = readlineSync.keyInYNStrict(chalk.request("Send test?"));

  handleOptions(options);
}

function handleOptions(options) {
  if (options.sailthru_push) {
    setTimeout(function () {
      sailthruAPI.initPush(file);
    }, 200);
  } else {
    console.log(chalk.success("Okay, skipped push."));
  }

  if (options.sailthru_test) {
    setTimeout(function () {
      sailthruAPI.initTest(newEntry);
    }, 2000);
  } else {
    console.log(chalk.success("Okay, skipped test."));
  }

  // console.log(chalk.error("Please commit to GitHub."));
}
