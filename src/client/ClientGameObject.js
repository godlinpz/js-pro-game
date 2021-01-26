import { animate, clamp } from '../engine/util';
import GameObject from '../models/GameObject';

class ClientGameObject extends GameObject {
    constructor(cfg) {
        super(cfg);
    }

    /**
     * Координаты объекта относительно окна отображения (канваса)
     * @param {int} offset_percent_x Сдвиг относительно верхнего левого угла в процентах от размера объекта
     * @param {int} offset_percent_y Сдвиг относительно верхнего левого угла в процентах от размера объекта
     */
    realPosition(offset_percent_x = 0, offset_percent_y = 0) {
        const win = this.cell.map.window;
        const pos = this.worldPosition(offset_percent_x, offset_percent_y);

        return {
            x: pos.x - win.x,
            y: pos.y - win.y,
        };
    }

    render(time, timeGap) {
        const map = this.cell.map;
        const ctx = this.cell.map.engine.ctx;
        // const cell = this.cell;

        if (this.speed) {
            this.animateMotion(time);
        }

        const pos = this.realPosition();
        const [x, y, w, h] = [pos.x, pos.y, map.cellWidth, map.cellHeight];

        const { type, size, spriteSize, sprite, states, frame } = this.cfg;

        if (type === 'static') {
            this.cell.map.engine.renderFrame({ sprite, frame, x, y, w, h });
        } else {
            const currentFrame = this.getCurrentFrame(time);
            this.cell.map.engine.renderFrame({ sprite, frame: currentFrame, x, y, w, h });
        }
        // inherit to render
        return [time, timeGap];
    }
}

export default ClientGameObject;
