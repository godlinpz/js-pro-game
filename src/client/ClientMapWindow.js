import { clamp } from '../engine/util';
import MovableObject from '../engine/MovableObject';

class ClientMapWindow extends MovableObject {
    constructor(cfg) {
        super(cfg);

        Object.assign(this, cfg, {
            followedObject: null,
        });
    }

    init() {
        const map = this.map;
        const cfg = this.cfg;

        Object.assign(this, {
            x: map.cellWidth * cfg.x,
            y: map.cellHeight * cfg.y,
            width: map.cellWidth * cfg.width,
            height: map.cellHeight * cfg.height,
        });
    }

    startCell() {
        const map = this.map;
        return map.cellAt(
            clamp(this.x - map.cellWidth, 0, map.worldWidth - 1),
            clamp(this.y - map.cellHeight, 0, map.worldHeight - 1),
        );
    }

    endCell() {
        const map = this.map;
        const winBottomRight = this.worldPosition(100, 100);
        return map.cellAt(
            clamp(winBottomRight.x + map.cellWidth, 0, map.worldWidth - 1),
            clamp(winBottomRight.y + map.cellHeight, 0, map.worldHeight - 1),
        );
    }

    focus(obj, smooth = true, speed = 200) {
        // сфокусироваться можно только на тех, у кого есть метод worldPosition
        const pos = obj.worldPosition(50, 50);
        this.moveTo(pos.x - this.width / 2, pos.y - this.height / 2, smooth, speed);
    }

    follow(obj) {
        this.followedObject = obj;
    }

    unfollow() {
        this.followedObject = null;
    }

    render(time, timeGap) {
        if (this.followedObject) {
            this.focus(this.followedObject, false);
        } else super.render(time, timeGap);
    }
}

export default ClientMapWindow;
