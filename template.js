var path = require('path'),
    fs   = require('fs');

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

var templateEngine = function(dir, left, right) {
    var templateDir = dir || ".";
    var leftDelimiter = left || "{{";
    var rightDelimiter = right || "}}";

    var template = function(filename, context) {
        var file = path.join(templateDir, filename);
        var content = fs.readFileSync(file, 'utf-8');
        var c = context || {};
        var output = content;
        var keys = Object.keys(c);
        keys.forEach(function(key) {
            output = replaceAll(output, leftDelimiter + key + rightDelimiter, c[key]);
        });
        return output;
    };

    return template;
};

module.exports = templateEngine;
