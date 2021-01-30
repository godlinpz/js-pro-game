import { animate, clamp } from '../engine/util';
import GameObject from '../models/GameObject';

class ClientGameObject extends GameObject {
    constructor(cfg) {
        super(cfg);
    }

    render(time, timeGap) {
        super.render(time, timeGap);

        const map = this.cell.map;

        const pos = this.canvasPosition();
        const [x, y, w, h] = [pos.x, pos.y, map.cellWidth, map.cellHeight];

        const { type, size, spriteSize, sprite, states, frame } = this.cfg;

        if (type === 'static') {
            this.cell.map.engine.renderSpriteFrame({ sprite, frame, x, y, w, h });
        } else {
            const currentFrame = this.getCurrentFrame(time);
            this.cell.map.engine.renderSpriteFrame({ sprite, frame: currentFrame, x, y, w, h });
        }
        // inherit to render
        return [time, timeGap];
    }
}

export default ClientGameObject;
