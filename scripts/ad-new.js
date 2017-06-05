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
  return chooseAdType();
}

function chooseAdType() {
  if (file.name == "sponsor_natives") {
    return getSponsorNative();
  } else if (file.name == "sponsor_banners") {
    return getSponsorBanner();
  } else if (file.name == "channel_banners") {
    getChannelBanner();
  }
}

function getSponsorNative() {
  console.log(chalk.request("Enter new native values.\n"));
  var newNative = {};

  newNative.date = readlineSync.question("Date (MM/dd/yy): ");
  newNative.newsletter = readlineSync.question("Newsletter (AM or PM): ");
  newNative.type = "Native";
  newNative.sponsor_name = readlineSync.question("Sponsor Name: ");
  newNative.sponsor_url = readlineSync.question("Sponsor URL: ");
  newNative.headline = readlineSync.question("Headline (Do not escape quotes): ");
  newNative.image_url = readlineSync.question("Image URL: ");

  // addJSON(newNative);
  return checkForConflict(newNative);
}

function getSponsorBanner() {
  console.log(chalk.request("Enter new banner values.\n"));
  var newBanner = {};

  newBanner.date = readlineSync.question("Date (MM/dd/yy): ");
  newBanner.newsletter = readlineSync.question("Newsletter (AM or PM): ");
  newBanner.type = "Banners";
  newBanner.sponsor_name = readlineSync.question("Sponsor Name: ");
  newBanner.sponsor_url = readlineSync.question("Sponsor URL: ");
  newBanner.position = readlineSync.question("Position (Top, Bottom, or Both): ");
  newBanner.image_url = readlineSync.question("Image URL: ");

  // addJSON(newBanner);
  return checkForConflict(newBanner);
}

function getChannelBanner() {
  console.log(chalk.request("Enter new banner values.\n"));
  var newBanner = {};

  newBanner.channel_name = readlineSync.question("Channel Name: ");
  newBanner.channel_url = readlineSync.question("Channel URL: ");
  newBanner.image_url = readlineSync.question("Image URL: ");

  addJSON(newBanner);
}

function checkForConflict(newEntry) {
  var adEntries = JSON.parse(file.data);
  var numOfDuplicates = 0;
  adEntries.forEach(function(oldEntry) {
    if (newEntry.date == oldEntry.date && newEntry.newsletter == oldEntry.newsletter) {
      // If "Native", then count as duplicate
      if (newEntry.type == "Native") {
        console.log(chalk.error("There is already a sponsored native for this date. Please contact Sales and notify."));
        numOfDuplicates++;
      // Else, assume "Banner" and check for duplicate positions
      } else if (newEntry.position == oldEntry.position) {
        console.log(chalk.error("There is already a sponsored banner for this date. Please contact Sales and notify."));
        numOfDuplicates++;
      }
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
