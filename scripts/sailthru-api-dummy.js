// API KEYS
var apiKey = 'ENTER API KEY';
var apiSecret = 'ENTER API SECRET';

// DEPENDENCIES
var sailthru = require('sailthru-client').createSailthruClient(apiKey, apiSecret);
var readlineSync = require("readline-sync");
var chalk = require("./console-colors.js");
var thisMinFile = {};

function initPush(minFile) {
  if (minFile) {
    thisMinFile = minFile;
  }
  else {
    thisMinFile = require("./file-get.js").fileGet("minified");
  }

  var newInclude = {
    include: 'phoenix_' + thisMinFile.name,
    content_html: '{set(\"' + thisMinFile.name + '\", ' + thisMinFile.data + ')}',
    content_text: '',
    content_sms: null,
    content_app: null
  };

  pushInclude(newInclude);
}

function pushInclude(newInclude) {
  sailthru.apiPost('include', newInclude, function(err, response) {
    if (err) {
      console.log(chalk.error('Error: ' + err.message));
    } else {
      console.log(chalk.success('The file was uploaded to Sailthru.'));
      console.log('Sailthru include is named phoenix_' + thisMinFile.name + '.');
    }
  });
}

function initTest() {
  console.log(chalk.request('Enter recipient email(s) for test.\n'));
  var recipients = readlineSync.promptCL();
  // console.log(chalk.success('You entered:\n' + recipients));
  console.log(chalk.success(recipients));

  var template = readlineSync.question("Use AM or PM template? ");
  console.log(chalk.success('You entered: ' + template));

  var testDate = readlineSync.question("Enter date (MM/dd/yy): ");
  console.log(chalk.success('You entered: ' + testDate));

  var other = {
    "vars": {
      "todays_date": testDate
    },
    "options": {
      "test": 1
    }
    // See https://getstarted.sailthru.com/developers/api/send/#POST_to_Send_Schedule_or_Update for more
  };

  if (template == "AM") {
    template = "[TEST] Phoenix AM w/ 600x150 Banners + Duplicate Story Prevention";
    sendTest(template, recipients, other);
  } else if (template == "PM") {
    template = "[TEST] Phoenix PM w/ 600x150 Banners + Duplicate Story Prevention";
    sendTest(template, recipients, other);
  } else {
    console.log(chalk.error('Did not recognize template.'));
  }
}

function sendTest(template, recipients, options) {
  sailthru.multiSend(template, recipients, options, function(err, response) {
    console.log(template, recipients, options);
    if (err) {
      console.log(chalk.error('Error: ' + err.message));
    } else {
      console.log(chalk.success('The test was sent to all recipients.'));
    }
  });
}

module.exports.initPush = initPush;
module.exports.initTest = initTest;
