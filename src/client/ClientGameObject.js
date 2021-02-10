import { clamp } from '../engine/util';
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

                ctx.textAlign = 'center';
                ctx.textBaseline = 'center';
                const measure = ctx.measureText(this.playerName);
                ctx.font = '16px sans-serif';

                const barWidth = clamp(measure.width, map.cellWidth, map.cellWidth * 1.4);
                const barX = x - (barWidth - map.cellWidth) / 2;

                ctx.fillStyle = '#ffffff4f';
                ctx.fillRect(barX, y - 30, barWidth, 20);

                ctx.fillStyle = 'black';
                ctx.fillText(this.playerName, barX + barWidth / 2, y - 15, barWidth);
            }
        }
        // inherit to render
        return [time, timeGap];
    }
}

export default ClientGameObject;
