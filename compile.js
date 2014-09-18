var path = require('path'),
    fs   = require('fs');

var extend = require('util')._extend;

/* // Command line input debugging
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});
console.log(process.cwd());
*/

var hivemindPath = path.dirname(process.argv[1]);
var hivemindDir = path.basename(hivemindPath);
var ignoreHivemindDir = false;

var inputPath = process.argv[2];
var projectPath;
if (inputPath) {
    projectPath = path.join(process.cwd(), inputPath);
} else {
    projectPath = process.cwd();
    ignoreHivemindDir = true;
}

var defaultsFile = "defaults.js";
var defaults = require(path.join(hivemindPath, defaultsFile));

var configFile = "config.js";
var config = {};
var options = {};

var projectFiles = fs.readdirSync(projectPath);

if (ignoreHivemindDir) {
    var hivemindDirIndex = projectFiles.indexOf(hivemindDir);
    if (hivemindDirIndex > -1) {
        projectFiles.splice(hivemindDirIndex, 1);
    }
}

if (projectFiles.indexOf(configFile) > -1) {
    var configPath = path.join(projectPath, configFile);
    var options = require(configPath);
}

var config = extend(defaults, options);

console.log(projectFiles);
console.log(config);

// Load main

var source = "";

var app = require(path.join(projectPath, config.mainFile));

console.log(app);

app.main();

// Write the final output file
fs.writeFile(path.join(projectPath, config.outputFile), source, 'utf-8');

console.log(config.outputFile + " written");
