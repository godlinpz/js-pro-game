import EventSourceMixin from '../engine/EventSourceMixin';
import { animate, animateObject, clamp } from '../engine/util';

class GameObject {
    constructor(cfg, cell = null) {
        Object.assign(this, cell ? cell.worldPosition() : { x: 0, y: 0 });
        Object.assign(this, cfg);

        Object.assign(this, {
            cfg: cfg,

            state: this.state || 'main',
            size: cfg.size || 100,
            layer: cfg.layer || 0,

            cell: cell,
        });
    }

    /**
     * Координаты объекта в мире
     * @param {int} offset_percent_x Сдвиг относительно верхнего левого угла в процентах от размера объекта
     * @param {int} offset_percent_y Сдвиг относительно верхнего левого угла в процентах от размера объекта
     */
    worldPosition(offset_percent_x = 0, offset_percent_y = 0) {
        return { x: this.x, y: this.y };
    }

    setCell(cell) {
        this.cell = cell;
    }

    setState(state, delay = 0) {
        clearTimeout(this.stateDelay);
        if (delay) this.stateDelay = setTimeout(() => this.setState(state), delay);
        else {
            this.state = state;
            this.animationStartTime = this.cell.map.engine.lastRenderTime;
        }
    }

    moveTo(x, y, smooth = true, speed = 200) {
        const map = this.cell.map;
        const [newX, newY] = [
            clamp(x, 0, map.worldWidth - map.cellWidth - 1),
            clamp(y, 0, map.worldHeight - map.cellHeight - 1),
        ];

        if (smooth) {
            animateObject(this, { newX, newY, map, speed });
        } else {
            this.x = newX;
            this.y = newY;
        }
    }

    moveToCell(cell, smooth = true, speed = 200) {
        if (this.cell) this.cell.remove(this);

        cell.push(this);
        this.moveTo(cell.x, cell.y, smooth, speed);
    }
}

Object.assign(GameObject.prototype, EventSourceMixin);

export default GameObject;
