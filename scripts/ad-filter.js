var readlineSync = require("readline-sync");
var chalk = require("./console-colors.js");
var fileSave = require("./file-save.js");
var file = require("./file-get.js").fileGet();

(function init() {
  if (file.name == "channel_banners") {
    console.log(chalk.error("This file does not hold dated entries. Please open and edit manually."));
  } else if (file) {
    filterJSON();
  } else {
    console.log(chalk.error("Error: Could not get file from scripts/file-get.js"));
  }
}());

function filterJSON() {
  file.data = JSON.parse(file.data);

  // There's some counterintuitive logic here. Today's date is set to yesterday's date, because the adDate < today on line 22 would filter current ads as well.

  var today = new Date();
  today = today.setDate(today.getDate() - 1);
  var outdated = [];

  file.data.forEach(function(adObj, index) {
    var adDate = new Date(adObj.date);

    if (adDate < today) {
      outdated.push(index);
    }
  });

  if (outdated.length > 0) {
    getConsent(outdated);
  } else {
    console.log("All entries are up-to-date.");
  }
}


function getConsent(outdated) {
  console.log("These entries are outdated: \n");

  for (var index = 0; index < outdated.length; index++) {
    if (file.name == "sponsor_natives") {
      console.log("- " + file.data[outdated[index]].date + " " + file.data[outdated[index]].headline + "\n");
    } else if (file.name == "sponsor_banners") {
      console.log("- " + file.data[outdated[index]].date + " " + file.data[outdated[index]].url + "\n");
    } else {
      console.log("Error: Could not get file name.");
    }
  }

  if (readlineSync.keyInYN("Delete these entries?")) {
    // Yes
    deleteOld(outdated);
  } else {
    // No or Other
    console.log("Okay, entries preserved.");
  }
}

function deleteOld(outdated) {
  var total = 0;
  outdated.forEach(function(value, index) {
    var removeThis = file.data.indexOf(value); // Value represents the slot of file.data that is outdated
    file.data.splice(removeThis, 1); // Remove this slot and only this one slot
    total = index + 1;
  });

  // NOTE: Must check if entry was actually deleted...
  if (total == 1) {
    console.log(total + " entry deleted.");
  } else {
    console.log(total + " entries deleted.");
  }

  file.data = JSON.stringify(file.data, null, 2); // beautifies JSON string output
  fileSave.fileSave(file, "unminified", "The file was updated.");
}
