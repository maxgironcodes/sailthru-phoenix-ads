// API KEYS
var apiKey = "ENTER API KEY";
var apiSecret = "ENTER API SECRET";

// DEPENDENCIES
var sailthru = require("sailthru-client").createSailthruClient(apiKey, apiSecret);
var readlineSync = require("readline-sync");
var chalk = require("./console-colors.js");

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

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
      console.log(chalk.success("The file was uploaded to Sailthru.\nSailthru include is named phoenix_" + includeName + "."));
    }
  });
}

function initTest(newEntry) {
  var test = {};

  if (newEntry) {
    test.date = newEntry.date;
    test.template = newEntry.newsletter;
    test.subject =
      newEntry.date + " " +
      newEntry.newsletter + " " +
      newEntry.sponsor_name + " (" +
      newEntry.type + ")";
  } else {
    file = require("./file-get.js").fileGet();
    file.data = JSON.parse(file.data);
    var condensedEntries = [];

    // 35 is the limit for readlineSync options
    for (i = 0; i < file.data.length; i++) {
      if (file.data.length < 35) {
        var thisEntry = file.data[i];
        condensedEntries.push(thisEntry.date + " " + thisEntry.newsletter + " " + thisEntry.sponsor_name + " (" + thisEntry.type + ")");
      }
    }

    var index = readlineSync.keyInSelect(condensedEntries, chalk.request("Send test for which ad? (Latest 35 entries)"));
    // console.log(condensedEntries.length);

    // When a user enters 0 for CANCEL, readlineSync returns index = -1
    if (index > -1) {
      test.date = file.data[index].date;
      test.template = file.data[index].newsletter;
      test.subject = condensedEntries[index];

      console.log(chalk.success("You selected " + test.subject + "."));
    }
  }

  if (isEmpty(test)) {
    console.log(chalk.success("Operation was cancelled."));
    return false;
  } else {
    console.log(chalk.request("Enter recipient email(s) for test.\n"));
    test.recipients = readlineSync.promptCL();

    // Strip commas in test.recipients
    for (i = 0; i < test.recipients.length; i++) {
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

    if (test.template == "AM" || "PM") {
      test.template = "[TEST] Phoenix " + test.template + " w/ 600x150 Banners + Duplicate Story Prevention";
      sendTest(test.template, test.recipients, other);
    } else {
      console.log(chalk.error("Did not recognize template."));
    }
  }
}

function sendTest(template, recipients, options) {
  sailthru.multiSend(template, recipients, options, function(err, response) {
    console.log(template, recipients, options);
    if (err) {
      console.log(chalk.error("Error: " + err.message));
    } else {
      console.log(chalk.success("The test was sent to all recipients."));
      console.log(chalk.request("Have you pushed to GitHub?\ngit commit -a -m \"" + options.vars.subject +  "\""));
    }
  });
}

module.exports.initPush = initPush;
module.exports.initTest = initTest;
