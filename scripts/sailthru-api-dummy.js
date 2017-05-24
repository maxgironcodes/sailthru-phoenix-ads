// API KEYS
var apiKey = "ENTER API KEY";
var apiSecret = "ENTER API SECRET";

// DEPENDENCIES
var sailthru = require("sailthru-client").createSailthruClient(apiKey, apiSecret);
var readlineSync = require("readline-sync");
var chalk = require("./console-colors.js");

function initPush(minFile) {
  var thisMinFile = {};

  if (minFile) {
    thisMinFile = minFile;
  }
  else {
    thisMinFile = require("./file-get.js").fileGet("minified");
  }

  var newInclude = {
    include: "phoenix_" + thisMinFile.name,
    content_html: "{set(\"" + thisMinFile.name + "\", " + thisMinFile.data + ")}",
    content_text: "",
    content_sms: null,
    content_app: null
  };

  pushInclude(newInclude, thisMinFile.name);
}

function pushInclude(newInclude, includeName) {
  sailthru.apiPost("include", newInclude, function(err, response) {
    if (err) {
      console.log(chalk.error("Error: " + err.message));
    } else {
      console.log(chalk.success("The file was uploaded to Sailthru."));
      console.log(chalk.success("Sailthru include is named phoenix_" + includeName + "."));
    }
  });
}

function initTest(newEntry) {
  var test = {};

  if (newEntry) {
    test.date = newEntry.date;
    test.template = newEntry.newsletter;
  } else {
    test.date = readlineSync.question("Enter date (MM/dd/yy): ");
    test.template = readlineSync.question("Use AM or PM template? ");
  }

  test.subject = readlineSync.question("Enter the subject line: ");

  console.log(chalk.request("Enter recipient email(s) for test.\n"));
  test.recipients = readlineSync.promptCL();

  // Strip commas in test.recipients
  for(i = 0; i < test.recipients.length; i++) {
    test.recipients[i] = test.recipients[i].replace(/,/g, '');
  }

  var other = {
    "vars": {
      "todays_date": test.date,
      "subject": test.subject
    },
    "options": {
      "test": 1
    }
    // See https://getstarted.sailthru.com/developers/api/send/#POST_to_Send_Schedule_or_Update for more
  };

  if (test.template == "AM") {
    test.template = "[TEST] Phoenix AM w/ 600x150 Banners + Duplicate Story Prevention";
    sendTest(test.template, test.recipients, other);
  } else if (test.template == "PM") {
    test.template = "[TEST] Phoenix PM w/ 600x150 Banners + Duplicate Story Prevention";
    sendTest(test.template, test.recipients, other);
  } else {
    console.log(chalk.error("Did not recognize template."));
  }
}

function sendTest(template, recipients, options) {
  sailthru.multiSend(template, recipients, options, function(err, response) {
    console.log(template, recipients, options);
    if (err) {
      console.log(chalk.error("Error: " + err.message));
    } else {
      console.log(chalk.success("The test was sent to all recipients."));
    }
  });
}

module.exports.initPush = initPush;
module.exports.initTest = initTest;
