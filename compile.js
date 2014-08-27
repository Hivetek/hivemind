var path = require('path'),
    fs   = require('fs');

/* // Command line input debugging
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});
console.log(process.cwd());
*/

var hivemindPath = path.dirname(process.argv[1]);
var projectPath = path.join(process.cwd(), process.argv[2]);

var defaultsFile = "defaults.js";
var defaults = require(path.join(hivemindPath, defaultsFile));

var configFile = "config.js";
var config = {};

var projectFiles = fs.readdirSync(projectPath);

if (projectFiles.indexOf(configFile) > -1) {
    var configPath = path.join(projectPath, configFile);
    var config = require(configPath);
}

console.log(projectFiles);
console.log(config);

// Load main
