var fs = require("fs");
var readlineSync = require("readline-sync");
var chalk = require("./console-colors.js");

function fileGet(state) {
  var file = {};
  var choices = ["sponsor_natives", "sponsor_banners"];
  var index = readlineSync.keyInSelect(choices, chalk.request("Select a file / ad type."));

  // When a user enters 0 for CANCEL, readlineSync returns index = -1
  if (index > -1) {
    file.name = choices[index];
    console.log(chalk.success("You selected " + file.name + "."));
  } else {
    console.log(chalk.success("Operation was cancelled."));
    return false;
  }

  if (state == "minified") {
    file.data = fs.readFileSync("./feeds/min/" + file.name + ".min.json", "utf8");
  } else {
    file.data = fs.readFileSync("./feeds/" + file.name + ".json", "utf8");
  }

  return file;
}

module.exports.fileGet = fileGet;
