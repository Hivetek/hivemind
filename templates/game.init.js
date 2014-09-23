function init() {
    canvas = document.getElementById("{{canvasid}}");
    ctx = this.canvas.getContext("2d");

    canvas.height = 500;
    canvas.width = 500;

    registerEvents();
}
