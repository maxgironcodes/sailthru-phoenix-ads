var readlineSync = require("readline-sync");
var chalk = require("./console-colors.js");
var fileSave = require("./file-save.js");
var file = {};

function getValidDate () {
  var regExp =/^\d{1,2}\/\d{1,2}\/\d{1,2}$/;
  var thisDate = readlineSync.question("Date (yy/MM/dd): ");

  while (!regExp.test(thisDate)) {
    console.log("Please enter date in correct format.");
    thisDate = readlineSync.question("Date (yy/MM/dd): ");
  }

  return thisDate;
}


function getValidUrl (thisQuestion) {
  var regExp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  var thisUrl = readlineSync.question(thisQuestion);

  while (!regExp.test(thisUrl)) {
    console.log("Please enter a valid url.");
    thisUrl = readlineSync.question(thisQuestion);
  }

  return thisUrl;
}

function init(thisFile) {
  if (thisFile) {
    file = thisFile;
  } else {
    file = require("./file-get.js").fileGet();
  }
  return chooseAdType();
}

function chooseAdType() {
  if (file.name == "sponsor_natives") {
    return getSponsorNative();
  } else if (file.name == "sponsor_banners") {
    return getSponsorBanner();
  }
}

function getSponsorNative() {
  console.log(chalk.request("Enter new native values.\n"));
  var newNative = {};

  newNative.date = getValidDate();
  newNative.newsletter = readlineSync.question("Newsletter (AM or PM): ", {limit: ["AM", "PM"], limitMessage: "Please enter AM or PM, in all-caps.", caseSensitive: true});
  newNative.type = "Native";
  newNative.sponsor_name = readlineSync.question("Sponsor Name: ");
  newNative.sponsor_url = getValidUrl("Sponsor URL: ");
  newNative.headline = readlineSync.question("Headline (Do not escape quotes): ");
  newNative.image_url = getValidUrl("Image URL: ");

  // addJSON(newNative);
  return checkForConflict(newNative);
}

function getSponsorBanner() {
  console.log(chalk.request("Enter new banner values.\n"));
  var newBanner = {};
  var useForBothPos = false;

  newBanner.date = getValidDate();
  newBanner.newsletter = readlineSync.question("Newsletter (AM or PM): ", {limit: ["AM", "PM"], limitMessage: "Please enter AM or PM, in all-caps.", caseSensitive: true});
  newBanner.type = "Banners";
  useForBothPos = readlineSync.keyInYNStrict("Use same banner for both positions? ");
  newBanner.sponsor_name = readlineSync.question("Sponsor Name: ");

  if (useForBothPos) {
    newBanner.both = {
      sponsor_url: "",
      image_url: ""
    };

    newBanner.both.sponsor_url = getValidUrl("Sponsor URL: ");
    newBanner.both.image_url = getValidUrl("Image URL: ");
  } else {
    newBanner.top = {
      sponsor_url: "",
      image_url: ""
    };
    newBanner.bottom = {
      sponsor_url: "",
      image_url: ""
    };

    newBanner.top.sponsor_url = getValidUrl("Top Sponsor URL: ");
    newBanner.top.image_url = getValidUrl("Top Image URL: ");
    newBanner.bottom.sponsor_url = getValidUrl("Bottom Sponsor URL: ");
    newBanner.bottom.image_url = getValidUrl("Bottom Image URL: ");
  }

  // addJSON(newBanner);
  return checkForConflict(newBanner);
}

function checkForConflict(newEntry) {
  var adEntries = JSON.parse(file.data);
  var numOfDuplicates = 0;
  adEntries.forEach(function(oldEntry) {
    if (newEntry.date == oldEntry.date && newEntry.newsletter == oldEntry.newsletter) {
      console.log(chalk.error("There is already a sponsor for this date. Please contact Sales and notify."));
      numOfDuplicates++;
    }
  });

  if (numOfDuplicates === 0) {
    addJSON(newEntry);
    return newEntry;
  } else {
    return false;
  }
}

function addJSON(newEntry) {
  var adEntries = JSON.parse(file.data);
  adEntries.push(newEntry);
  file.data = JSON.stringify(adEntries, null, 2); // beautifies JSON string output
  fileSave.fileSave(file, "unminified", "\nNew entry added to " + file.name + ".");
}

module.exports.init = init;
