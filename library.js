var library = (function() {
    /**
     * Data
     * The object containing the necessary data to compile
     */
    var data = {
        keyBinds: []
    };

    var register = (function() {

        function addKeyBind(key, fn, type) {
            data.keyBinds.push({key: key, fn: fn, type: type});
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

    return {
        data: data,
        register: register,
    };
})();

module.exports = library;
