var path = require('path'),
    fs   = require('fs');

var extend = require('util')._extend;
var templateEngine = require('./template');

var UglifyJS = require("uglify-js");

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

        addKeyBind("a", function() {
            console.log("A pressed");
        }, "keydown");

        var keydown = "", keyup = "";

        keyBinds.forEach(function(element) {
            var str = template("keybinds.key.js", {
                key: element.key.charCodeAt(0),
                fn:  element.fn.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1]
            });
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

        var output = template("main.js", {
            source: s
        });

        return output;
    };

    /**
     * Use UglifyJS to minify source code
     */
    self.minify = function(source) {
        var minified = UglifyJS.minify(source, {fromString: true});
        return minified.code;
    };

    /**
     * Add comment header
     */
    self.addHeader = function(source) {
        var header = template("main.header.js", {
            projectname: config.projectName
        });
        return header + source;
    }

    /**
     * Write the final output file
     */
    self.writeOutput = function(sourceString) {
        var finalSourceString = self.addHeader(sourceString);
        fs.writeFile(path.join(projectPath, config.outputFile), finalSourceString, 'utf-8');

        console.log(config.outputFile + " written");
    };

    /**
     * Putting it all together
     */
    self.run = function() {
        self.init(process.argv);
        var source = self.generateCode();
        var sourceString = self.buildSource(source);
        //var minified = self.minify(sourceString);
        //self.writeOutput(minified);
        self.writeOutput(sourceString);
    };

    return self;
})();

compiler.run();
