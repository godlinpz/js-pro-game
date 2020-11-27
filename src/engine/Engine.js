class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.canvas.tabIndex = 1000;
        this.canvas.style.outline = 'none';

        this.onRender = null;
        this.onKeyDown = null;

        canvas.addEventListener('keydown', (e) => this.onKeyDown && this.onKeyDown(e), false);
    }

    start(onRender, onKeyDown) {
        this.onRender = onRender;
        this.onKeyDown = onKeyDown;
        this.loop();
    }

    loop() {
        this.onRender && this.onRender();

        window.requestAnimationFrame(this.loop.bind(this));
    }
}

export default Engine;
