var library = (function() {
    var self = {};

    /**
     * Data
     * The object containing the necessary data to compile
     */
    self.data = {
        keyBinds: []
    };

    self.helper = (function() {
        function camelize(str) {
            return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
                if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
                return index == 0 ? match.toLowerCase() : match.toUpperCase();
            });
        }

        return {
            camelize: camelize
        };
    })();

    self.functionLibrary = (function() {

    })();

    self.entity = (function() {
        return function(name, setup, update, draw) {

        };
    })();

    self.register = (function() {

        function addKeyBind(key, fn, type) {
            self.data.keyBinds.push({key: key, fn: fn, type: type});
        }

        function keyDown(key, fn) {
            addKeyBind(key, fn, "keydown");
        }

        function keyUp(key, fn) {
            addKeyBind(key, fn, "keyup");
        }

        return {
            addKeyBind: addKeyBind,
            keyDown: keyDown,
            keyUp: keyUp
        };
    })();

    return self;
})();

module.exports = library;
