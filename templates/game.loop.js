function loop() {
    lastTime = currentTime;
    currentTime = Date.now();
    deltaTime = currentTime - lastTime;

    update(deltaTime);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(ctx);

    requestAnimFrame(function() {
        loop();
    });
}
