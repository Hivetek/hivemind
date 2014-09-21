var library = (function() {
    var keyBinds = [];

    var register = (function() {

        function addKeyBind(key, fn, type) {
            keyBinds.push({key: key, fn: fn, type: type});
        }

        function keyDown(key, fn) {
            addKeyBind(key, fn, "keydown");
        }

        function keyUp(key, fn) {
            addKeyBind(key, fn, "keyup");
        }

        return {
            keyBinds: keyBinds,
            addKeyBind: addKeyBind,
            keyDown: keyDown,
            keyUp: keyUp
        };
    })();

    return {
        register: register,
        keyBinds: keyBinds
    };
})();

module.exports = library;
