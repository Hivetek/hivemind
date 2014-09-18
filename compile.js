var path = require('path'),
    fs   = require('fs');

var extend = require('util')._extend;

/**
 * Main compiler
 */
var compiler = (function() {
    var self = {};

    /**
     * Vars
     */
    var source = {};
    var hivemindPath, hivemindDir, projectPath, projectFiles, 
        defaults, config, app;

    self.init = function() {
        hivemindPath = path.dirname(process.argv[1]);
        hivemindDir = path.basename(hivemindPath);
        var ignoreHivemindDir = false;

        var inputPath = process.argv[2];
        if (inputPath) {
            projectPath = path.join(process.cwd(), inputPath);
        } else {
            projectPath = process.cwd();
            ignoreHivemindDir = true;
        }

        var defaultsFile = "defaults.js";
        defaults = require(path.join(hivemindPath, defaultsFile));

        var configFile = "config.js";
        config = {};
        var options = {};

        projectFiles = fs.readdirSync(projectPath);

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

        config = extend(defaults, options);
    };

    self.generate = function() {
        app = require(path.join(projectPath, config.mainFile));

        console.log(app);

        app.main();
    };

    self.buildSource = function() {
        var s = "";

        return s;
    };

    self.writeOutput = function(source) {
        // Write the final output file
        fs.writeFile(path.join(projectPath, config.outputFile), source, 'utf-8');

        console.log(config.outputFile + " written");
    };

    self.run = function() {
        self.init();
        self.generate();
        var sourceString = self.buildSource();
        self.writeOutput(sourceString);
    };

    return self;
})();

compiler.run();
