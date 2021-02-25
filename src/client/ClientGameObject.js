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
                const playerName = this.playerName;

                ctx.textAlign = 'center';
                ctx.textBaseline = 'center';
                const measure = ctx.measureText(playerName);
                ctx.font = '16px sans-serif';

                const barWidth = clamp(measure.width, map.cellWidth, map.cellWidth * 1.4);
                const barX = x - (barWidth - map.cellWidth) / 2;

                ctx.fillStyle = this.isNpc ? '#ffff0099' : '#ffffff4f';
                ctx.fillRect(barX, y - 30, barWidth, 20);

                ctx.fillStyle = 'black';
                ctx.fillText(playerName, barX + barWidth / 2, y - 15, barWidth);
            }
        }
        // inherit to render
        return [time, timeGap];
    }

    isInsideWindow() {
        const window = this.cell.map.window;
        const wTopLeft = window.worldPosition(),
            wBottomRight = window.worldPosition(100, 100),
            topLeft = this.worldPosition(),
            bottomRight = this.worldPosition(100, 100);

        return (
            topLeft.x <= wBottomRight.x &&
            topLeft.y <= wBottomRight.y &&
            bottomRight.x >= wTopLeft.x &&
            bottomRight.y >= wTopLeft.y
        );
    }
}

export default ClientGameObject;
