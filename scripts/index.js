var file = require("./file-get.js").fileGet();
var readlineSync = require("readline-sync");
var chalk = require("./console-colors.js");
var sailthruAPI = require("./sailthru-api.js");
var simpleGit = require("simple-git")();

if (file) {
  var adNew = require("./ad-new.js");
  var newEntry = adNew.init(file);

  if (newEntry) {
    var adSort = require("./ad-sort.js").init(file);
    var adMinify = require("./ad-minify.js").init(file);

    setTimeout(function() {
      // requestGitHubPush();
      requestSailthruPush();
      requestSailthruTest();
    }, 200);
  }
}

function requestSailthruPush() {
  if (readlineSync.keyInYN(chalk.request("Push data to Sailthru?"))) {
    // Yes
    sailthruAPI.initPush(file);
  } else {
    // No or Other
    console.log(chalk.success("Okay..."));
  }
}

function requestGitHubPush() {
  if (readlineSync.keyInYN(chalk.request("Push data to GitHub?"))) {
    // Yes
    newEntry.project = readlineSync.question("Enter project name: ");
    simpleGit.commit(newEntry.project);
    simpleGit.push('origin', 'append-git-push-to-start');
  } else {
    // No or Other
    console.log(chalk.success("Okay..."));
  }
}

function requestSailthruTest() {
  if (readlineSync.keyInYN(chalk.request("Send test?"))) {
    // Yes
    newEntry.project = readlineSync.question("Enter project name: ");
    sailthruAPI.initTest(newEntry);
  } else {
    // No or Other
    console.log(chalk.success("Okay, no test was sent."));
  }
}
