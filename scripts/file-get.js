var fs = require("fs");
var readlineSync = require("readline-sync");
var chalk = require("./console-colors.js");

function fileGet(state) {
  var file = {};
  var choices = ["sponsor_natives", "sponsor_banners", "channel_banners"];
  var index = readlineSync.keyInSelect(choices, chalk.request("Edit which file?"));

  if (choices[index]) {
    file.name = choices[index];
    console.log(chalk.success("You selected " + file.name + "."));
  } else {
    console.log(chalk.success("Operation was cancelled."));
    return false;
  }

  if (state == "minified") {
    file.data = fs.readFileSync("./ads/min/" + file.name + ".min.json", "utf8");
  } else {
    file.data = fs.readFileSync("./ads/" + file.name + ".json", "utf8");
  }

  return file;
}

module.exports.fileGet = fileGet;
