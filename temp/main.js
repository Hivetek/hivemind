function Cube(game) {
    this.game = game;

    this.p = {
        x: 100,
        y: 100
    };
    this.v = {
        x: 0,
        y: 0
    };
    this.a = {
        x: 0,
        y: 0
    };

    this.keys = {
        "up": false,
        "down": false,
        "left": false,
        "right": false,
    };
}

Cube.prototype.reset = function() {
    // Reset
    this.a.x = this.a.y = 0;
};

Cube.prototype.update = function(dt) {
    this.reset();

    var d = 0.001;
    if (this.keys.left) {
        this.a.x -= d;
    }
    if (this.keys.up) {
        this.a.y -= d;
    }
    if (this.keys.right) {
        this.a.x += d;
    }
    if (this.keys.down) {
        this.a.y += d;
    }

    this.v.x += this.a.x * dt;
    this.v.y += this.a.y * dt;
    this.p.x += this.v.x * dt;
    this.p.y += this.v.y * dt;
};

Cube.prototype.draw = function(c) {
    c.beginPath();
    c.rect(this.p.x, this.p.y, 10, 10);
    c.fillStyle = 'black';
    c.fill();
};

function Game() {

    this.startTime = Date.now();
    this.lastTime;
    this.currentTime = this.startTime;
    this.dt;

    this.cube = new Cube(this);

    this.keys = [];
}

Game.prototype.init = function() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.canvas.height = 500;
    this.canvas.width = 500;

    this.registerEvents();
};

Game.prototype.loop = function() {
    this.lastTime = this.currentTime;
    this.currentTime = Date.now();
    this.dt = this.currentTime - this.lastTime;

    this.update(this.dt);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.draw(this.ctx);

    requestAnimFrame(function() {
        this.loop();
    }.bind(this));
}

Game.prototype.update = function(dt) {
    // Controller
    this.cube.keys.left = this.keys[37];
    this.cube.keys.up = this.keys[38];
    this.cube.keys.right = this.keys[39];
    this.cube.keys.down = this.keys[40];

    this.cube.update(dt);
}

Game.prototype.draw = function(c) {
    this.cube.draw(c);
}

Game.prototype.registerEvents = function() {
    var self = this;
    window.addEventListener('keydown', function(event) {
        self.keys[event.keyCode] = true;
    }, false);

    window.addEventListener('keyup', function(event) {
        self.keys[event.keyCode] = false;
    }, false);
};

// RequestAnimationFrame
window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        window.setTimeout(callback, 1000.0 / 60);
    };
})();

// Start
var game = new Game();
game.init();
game.loop();
