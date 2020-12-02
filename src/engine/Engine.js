class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.canvas.tabIndex = 1000;
        this.canvas.style.outline = 'none';

        this.onRender = null;
        this.onKeyDown = null;
        this.onKeyUp = null;

        this.startTime = 0;
        this.lastRenderTime = 0;

        this.sprites = {};
        this.images = {};

        this.thisLoop = this.loop.bind(this);

        canvas.addEventListener('keydown', (e) => this.onKeyDown && this.onKeyDown(e), false);
        canvas.addEventListener('keyup', (e) => this.onKeyUp && this.onKeyUp(e), false);
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

    start(onRender, onKeyDown, onKeyUp) {
        this.onRender = onRender;
        this.onKeyDown = onKeyDown;
        this.onKeyUp = onKeyUp;

        this.loop();
    }

    loop(timestamp) {
        if (!this.startTime) {
            this.startTime = timestamp;
            this.lastRenderTime = 0;
        }

        const oldTime = this.lastRenderTime;
        this.lastRenderTime = timestamp - this.startTime;

        this.onRender && this.onRender(this.lastRenderTime, timestamp - oldTime);

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

export default Engine;
