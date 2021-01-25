import EventSourceMixin from './EventSourceMixin';

class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.canvas.tabIndex = 1000;
        this.canvas.style.outline = 'none';

        this.startTime = 0;
        this.lastRenderTime = 0;
        this.lastTimestamp = 0;
        this.pausedAt = 0; // not paused

        this.sprites = {};
        this.images = {};

        this.thisLoop = this.loop.bind(this);

        this.keysPressed = new Set();

        canvas.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        canvas.addEventListener('keyup', (e) => this.onKeyUp(e), false);
        canvas.addEventListener('mousedown', (e) => this.onMouseDown(e), false);
        canvas.addEventListener('mouseup', (e) => this.onMouseUp(e), false);
    }

    onKeyDown(e) {
        this.keysPressed.add(e.code);
        this.trigger('keydown', e);
    }
    onKeyUp(e) {
        this.keysPressed.delete(e.code);
        this.trigger('keyup', e);
    }
    onMouseDown(e) {
        this.trigger('mousedown', e);
    }
    onMouseUp(e) {
        this.trigger('mouseup', e);
    }

    loadSprites(spriteGroups) {
        const imageLoaders = [];

        for (let groupName in spriteGroups) {
            const group = spriteGroups[groupName];
            this.sprites[groupName] = group;

            for (let spriteName in group) {
                const sprite = group[spriteName];

                const img = sprite.img;
                if (!this.images[img]) imageLoaders.push(this.loadImage(img));
            }
        }

        return Promise.all(imageLoaders);
    }

    loadImage(url) {
        return new Promise((resolve) => {
            let i = new Image();
            this.images[url] = i;
            i.onload = () => resolve(i);
            i.src = url;
        });
    }

    start() {
        this.loop();
    }

    pause() {
        if (!this.pausedAt) {
            console.log('PAUSE');
            this.pausedAt = this.lastTimestamp;
        }
    }

    unpause() {
        if (this.pausedAt) {
            console.log('UNPAUSE');
            this.startTime += this.lastTimestamp - this.pausedAt;
            this.pausedAt = 0;
        }
    }

    loop(timestamp) {
        if (!this.startTime) {
            this.startTime = timestamp;
            this.lastRenderTime = 0;
        }

        const oldTime = this.lastRenderTime;
        this.lastRenderTime = timestamp - this.startTime;
        this.lastTimestamp = timestamp;

        this.trigger('prerender', [this.lastRenderTime, timestamp - oldTime]);

        if (!this.pausedAt) this.trigger('render', [this.lastRenderTime, timestamp - oldTime]);

        window.requestAnimationFrame(this.thisLoop);
    }

    renderFrame({ sprite, frame, x, y, w, h }) {
        const spriteCfg = this.sprites[sprite[0]][sprite[1]];
        const [fx, fy, fw, fh] = spriteCfg.frames[frame];
        const img = this.images[spriteCfg.img];

        // console.log(spriteCfg, frame);
        // console.log(img, fx, fy, fw, fh, x, y, w, h);

        this.ctx.drawImage(img, fx, fy, fw, fh, x, y, w, h);
    }
}

Object.assign(Engine.prototype, EventSourceMixin);

export default Engine;
