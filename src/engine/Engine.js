class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.canvas.tabIndex = 1000;
        this.canvas.style.outline = 'none';

        this.onRender = null;
        this.onKeyDown = null;

        this.startTime = 0;
        this.lastRenderTime = 0;

        this.sprites = {};
        this.images = {};

        this.thisLoop = this.loop.bind(this);

        canvas.addEventListener('keydown', (e) => this.onKeyDown && this.onKeyDown(e), false);
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

    start(onRender, onKeyDown) {
        this.onRender = onRender;
        this.onKeyDown = onKeyDown;

        this.loop();
    }

    loop(timestamp) {
        if (!this.startTime) {
            this.startTime = timestamp;
            this.lastRenderTime = timestamp;
        }

        this.onRender && this.onRender(timestamp - this.startTime, timestamp - this.lastRenderTime);
        this.lastRenderTime = timestamp;

        window.requestAnimationFrame(this.thisLoop);
    }
}

export default Engine;
