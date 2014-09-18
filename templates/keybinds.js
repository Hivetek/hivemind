window.addEventListener('keydown', function(event) { 
    keys[event.keyCode] = true;
    {{keydown}}
}, false);

window.addEventListener('keyup', function(event) { 
    keys[event.keyCode] = false;
    {{keyup}}
}, false);
