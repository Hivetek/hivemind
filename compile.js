var path = require('path'),
    fs   = require('fs');

var extend = require('util')._extend;
var templateEngine = require('./template');

/**
 * Main compiler
 */
var compiler = (function() {
    var self = {}; // The interface to the outside

    /**
     * Vars
     */
    var hivemindPath, hivemindDir, projectPath, projectFiles, templateDir,
        template, defaults, config, app;

    /**
     * Handle command line input and load config file
     */
    self.init = function(argv) {
        hivemindPath = path.dirname(argv[1]);
        hivemindDir = path.basename(hivemindPath);
        var ignoreHivemindDir = false;

        var inputPath = argv[2];
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

        templateDir = path.join(hivemindPath, "templates");
        template = templateEngine(templateDir);

        config = extend(defaults, options);
    };

    /**
     * Generate code in segments stored in an object
     */
    self.generateCode = function() {
        var source = {};

        app = require(path.join(projectPath, config.mainFile));

        console.log(app);

        app.main();

        source.startVars = template("startvars.js", {}); 

        var keyBinds = [];

        function addKeyBind(key, fn, type) {
            keyBinds.push({key: key, fn: fn, type: type});
        }

        function addVariables(str){

        }

        var keydown = "", keyup = "";

        keyBinds.forEach(function(element) {
            var str = "";
                str += "if (event.keyCode === " + element.key.charCodeAt(0) + ") {";
                str += element.fn.toString() + "}";
            if (element.type === "keydown") {
                keydown += str;
            } else if (element.type === "keyup") {
                keyup += str;
            }
        });

        source.keyBinds = template("keybinds.js", {
            keydown: keydown,
            keyup:   keyup
        });
        
        return source;
    };

    /**
     * Build generated code segments to final source code
     */
    self.buildSource = function(source) {
        var s = "";
        var keys = Object.keys(source);
        keys.forEach(function(element) {
            s += source[element];
        });
        return s;
    };

    /**
     * Write the final output file
     */
    self.writeOutput = function(sourceString) {
        var output = template("main.js", {
            source: sourceString,
            projectname: config.projectName
        });

        fs.writeFile(path.join(projectPath, config.outputFile), output, 'utf-8');

        console.log(config.outputFile + " written");
    };

    /**
     * Putting it all together
     */
    self.run = function() {
        self.init(process.argv);
        var source = self.generateCode();
        var sourceString = self.buildSource(source);
        self.writeOutput(sourceString);
    };

    return self;
})();

compiler.run();
