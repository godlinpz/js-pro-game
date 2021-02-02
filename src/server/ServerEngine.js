import Engine from '../engine/Engine';

class ServerEngine extends Engine {
    constructor(canvas) {
        super();

        this.sprites = {};
        this.images = {};
    }

    initNextFrame() {
        // window.requestAnimationFrame(this.thisLoop);
    }
}

export default ServerEngine;
