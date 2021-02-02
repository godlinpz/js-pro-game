import EventSourceMixin from './EventSourceMixin';

class Engine {
    constructor() {
        this.startTime = 0;
        this.lastRenderTime = 0;
        this.lastTimestamp = 0;
        this.pausedAt = 0; // not paused

        this.thisLoop = this.loop.bind(this);
    }

    loadSprites(spriteGroups) {
        const imageLoaders = [];

        for (let groupName in spriteGroups) {
            const group = spriteGroups[groupName];
            this.sprites[groupName] = group;

            for (let spriteName in group) {
                const sprite = group[spriteName];
                this.loadSprite(sprite);
            }
        }

        return Promise.all(imageLoaders);
    }

    loadSprite(sprite) {}

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

        this.initNextFrame();
    }

    initNextFrame() {
        setTimeout(this.thisLoop, 100);
    }
}

Object.assign(Engine.prototype, EventSourceMixin);

export default Engine;
