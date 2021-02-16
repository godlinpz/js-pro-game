import Engine from '../engine/Engine';
import ClientInput from './ClientInput';

class ClientEngine extends Engine {
    constructor(canvas) {
        super();

        Object.assign(this, {
            canvas,

            canvases: {
                main: canvas,
            },
            ctx: null,

            imageLoaders: [],

            sprites: {},
            images: {},

            input: new ClientInput(canvas),
        });

        this.switchCanvas('main');

        canvas.tabIndex = 1000;
        canvas.style.outline = 'none';
    }

    loadSprites(spriteGroups) {
        this.imageLoaders = [];

        super.loadSprites(spriteGroups);

        return Promise.all(this.imageLoaders);
    }

    loadSprite(sprite) {
        super.loadSprite(sprite);

        const img = sprite.img;
        if (!this.images[img]) this.imageLoaders.push(this.loadImage(img));
    }

    loadImage(url) {
        return new Promise((resolve) => {
            let i = new Image();
            this.images[url] = i;
            i.onload = () => resolve(i);
            i.src = (process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH + '/' : '') + url;
        });
    }

    loop(timestamp) {
        const { ctx, canvas } = this;
        ctx.fillStyle = 'black';
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        super.loop(timestamp);
    }

    initNextFrame() {
        window.requestAnimationFrame(this.thisLoop);
    }

    renderSpriteFrame({ sprite, frame, x, y, w, h }) {
        const spriteCfg = this.sprites[sprite[0]][sprite[1]];
        const [fx, fy, fw, fh] = spriteCfg.frames[frame];
        const img = this.images[spriteCfg.img];

        // console.log(spriteCfg, frame);
        // console.log(img, fx, fy, fw, fh, x, y, w, h);

        this.ctx.drawImage(img, fx, fy, fw, fh, x | 0, y | 0, w | 0, h | 0);
    }

    addCanvas(name, width, height) {
        let canvas = this.canvases[name];

        if (!canvas) {
            canvas = window.document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            this.canvases[name] = canvas;
        }

        return canvas;
    }

    switchCanvas(name) {
        const canvas = this.canvases[name];
        if (canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
        }

        return canvas;
    }

    renderCanvas(name, fromPos, toPos) {
        const canvas = this.canvases[name];

        if (canvas) {
            this.ctx.drawImage(
                canvas,
                fromPos.x,
                fromPos.y,
                fromPos.width,
                fromPos.height,
                toPos.x,
                toPos.y,
                toPos.width,
                toPos.height,
            );
        }
    }
}

export default ClientEngine;
