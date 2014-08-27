var keyBinds = [];
var source;

function addKeyBind(key, fn, type) {
    keyBinds.push({key: key, fn: fn, type: type});
}

function addVariables(str){
    
}

function generateCode() {
    //Starting variables
    source.startVars =+ "var keys = []; var canvas, ctx, startTime, lastTime, currentTime, deltaTime, timeScale;";
    
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
};