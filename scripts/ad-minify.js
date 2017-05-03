var minify = require("node-json-minify"); // this module also strips commenting
var fileSave = require("./file-save.js");
var file = {};

function init(thisFile) {
  if (thisFile) {
    file = thisFile;
  } else {
    file = require("./file-get.js").fileGet();
  }
  minifyJSON();
}

function minifyJSON() {
  file.data = minify(file.data);
  fileSave.fileSave(file, "minified", "The file was minified.");
}

module.exports.init = init;
