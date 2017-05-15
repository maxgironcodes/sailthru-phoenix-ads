var readlineSync = require("readline-sync");
var chalk = require("./console-colors.js");
var fileSave = require("./file-save.js");
var file = {};

function init(thisFile) {
  if (thisFile) {
    file = thisFile;
  } else {
    file = require("./file-get.js").fileGet();
  }
  chooseAdType();
}

function chooseAdType() {
  if (file.name == "sponsor_natives") {
    getSponsorNative();
  } else if (file.name == "sponsor_banners") {
    getSponsorBanner();
  } else if (file.name == "channel_banners") {
    getChannelBanner();
  }
}

function getSponsorNative() {
  console.log(chalk.request("Enter new native values.\n"));
  var newNative = {};

  newNative.date = readlineSync.question("Date (MM/dd/yy): ");
  newNative.newsletter = readlineSync.question("Newsletter (AM or PM): ");
  newNative.headline = readlineSync.question("Headline: ");
  newNative.url = readlineSync.question("Sponsor URL: ");
  newNative.image = readlineSync.question("Image URL: ");

  // addJSON(newNative);
  checkForConflict(newNative);
}

function getSponsorBanner() {
  console.log(chalk.request("Enter new banner values.\n"));
  var newBanner = {};

  newBanner.date = readlineSync.question("Date (MM/dd/yy): ");
  newBanner.newsletter = readlineSync.question("Newsletter (AM or PM): ");
  newBanner.position = readlineSync.question("Position (Top, Bottom, or Both): ");
  newBanner.url = readlineSync.question("Sponsor URL: ");
  newBanner.image = readlineSync.question("Image URL: ");

  // addJSON(newBanner);
  checkForConflict(newNative);
}

function getChannelBanner() {
  console.log(chalk.request("Enter new banner values.\n"));
  var newBanner = {};

  newBanner.name = readlineSync.question("Channel Name: ");
  newBanner.url = readlineSync.question("Channel URL: ");
  newBanner.image = readlineSync.question("Image URL: ");

  addJSON(newBanner);
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
  }
}

function addJSON(newEntry) {
  var adEntries = JSON.parse(file.data);
  adEntries.push(newEntry);
  file.data = JSON.stringify(adEntries, null, 2); // beautifies JSON string output
  fileSave.fileSave(file, "unminified", "\nNew entry added to " + file.name + ".");
}

module.exports.init = init;
