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

    self.generateCode = function() {
        var source = {};

        app = require(path.join(projectPath, config.mainFile));

        console.log(app);

        app.main();

        var keyBinds = [];

        function addKeyBind(key, fn, type) {
            keyBinds.push({key: key, fn: fn, type: type});
        }

        function addVariables(str){

        }

        //Starting variables
        source.startVars = "";
        source.startVars += "var keys = []; var canvas, ctx, startTime, lastTime, currentTime, deltaTime, timeScale;";

        //Keybinds
        source.keyBinds = "window.addEventListener('keydown', function(event) { keys[event.keyCode] = true;";
        for (var i = 0; i < keyBinds.length; i++) {
            if (keyBinds[i].type === "keydown") {
                source.keyBinds += "if (event.keyCode === " + keyBinds[i].key.charCodeAt(0) + ") {";
                source.keyBinds += keyBinds[i].fn.toString() + "}";
            }
        }
        source.keyBinds += "}, false);";

        source.keyBinds = "window.addEventListener('keyup', function(event) { keys[event.keyCode] = false;";
        for (var i = 0; i < keyBinds.length; i++) {
            if (keyBinds[i].type === "up") {
                source.keyBinds += "if (event.keyCode === " + keyBinds[i].key.charCodeAt(0) + ") {";
                source.keyBinds += keyBinds[i].fn.toString() + "}";
            }
        }
        source.keyBinds += "}, false);";

        return source;
    };

    self.buildSource = function(source) {
        var s = "";
        var keys = Object.keys(source);
        keys.forEach(function(element) {
            s += source[element];
        });
        return s;
    };

    self.writeOutput = function(source) {
        // Write the final output file
        fs.writeFile(path.join(projectPath, config.outputFile), source, 'utf-8');

        console.log(config.outputFile + " written");
    };

    self.run = function() {
        self.init();
        var source = self.generateCode();
        var sourceString = self.buildSource(source);
        self.writeOutput(sourceString);
    };

    return self;
})();

compiler.run();
