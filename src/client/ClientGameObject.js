import { animate, clamp } from '../engine/util';
import GameObject from '../models/GameObject';

class ClientGameObject extends GameObject {
    constructor(cfg) {
        super(cfg);
    }

    render(time, timeGap) {
        super.render(time, timeGap);

        const map = this.cell.map;
        const engine = map.engine;

        const pos = this.canvasPosition();
        const [x, y, w, h] = [pos.x, pos.y, map.cellWidth, map.cellHeight];

        const { type, size, spriteSize, sprite, states, frame } = this.cfg;

        if (type === 'static') {
            engine.renderSpriteFrame({ sprite, frame, x, y, w, h });
        } else {
            const currentFrame = this.getCurrentFrame(time);
            engine.renderSpriteFrame({ sprite, frame: currentFrame, x, y, w, h });

            if (this.playerName) {
                const ctx = engine.ctx;

                ctx.fillStyle = '#ffffff4f';
                ctx.fillRect(x, y - 30, map.cellWidth, 20);

                ctx.fillStyle = 'black';

                ctx.textAlign = 'center';
                ctx.textBaseline = 'center';
                ctx.font = '16px sans-serif';
                ctx.fillText(this.playerName, x + map.cellWidth / 2, y - 15, map.cellWidth);
            }
        }
        // inherit to render
        return [time, timeGap];
    }
}

export default ClientGameObject;
