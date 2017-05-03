var fs = require("fs");
var chalk = require("./console-colors.js");

function fileSave(file, state, message) {
  if (state == "minified") {
    fs.writeFile("./ads/min/" + file.name + ".min.json", file.data, function() {
      console.log(chalk.success(message));
    });
  } else if (state == "unminified") {
    fs.writeFile("./ads/" + file.name + ".json", file.data, function() {
      console.log(chalk.success(message));
    });
  } else {
    console.log(chalk.error("Error: State was not defined."));
  }
}

module.exports.fileSave = fileSave;
