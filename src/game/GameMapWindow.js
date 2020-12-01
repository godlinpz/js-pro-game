import { animateObject, clamp } from '../engine/util';

class GameMapWindow {
    constructor(map, cfg) {
        Object.assign(this, cfg);
        this.map = map;
        this.cfg = cfg;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;

        this.toX = 0;
        this.toY = 0;
        this.deltaX = 0;
        this.deltaY = 0;

        this.speed = 0;

        this.animationStartTime = 0;

        this.followedObject = null;
    }

    init() {
        const map = this.map;
        const cfg = this.cfg;

        this.x = map.cellWidth * cfg.x;
        this.y = map.cellHeight * cfg.y;
        this.width = map.cellWidth * cfg.width;
        this.height = map.cellHeight * cfg.height;
    }

    /**
     * Координаты объекта в мире
     * @param {int} offset_percent_x Сдвиг относительно верхнего левого угла в процентах от размера объекта
     * @param {int} offset_percent_y Сдвиг относительно верхнего левого угла в процентах от размера объекта
     */
    worldPosition(offset_percent_x = 0, offset_percent_y = 0) {
        return {
            x: this.x + (this.width * offset_percent_x) / 100,
            y: this.y + (this.height * offset_percent_y) / 100,
        };
    }

    startCell() {
        const map = this.map;
        return map.cellAt(clamp(this.x, 0, map.worldWidth - 1), clamp(this.y, 0, map.worldHeight - 1));
    }

    endCell() {
        const map = this.map;
        const winBottomRight = this.worldPosition(100, 100);
        return map.cellAt(
            clamp(winBottomRight.x, 0, map.worldWidth - 1),
            clamp(winBottomRight.y, 0, map.worldHeight - 1),
        );
    }

    moveTo(x, y, smooth = true, speed = 200) {
        const map = this.map;
        const [newX, newY] = [
            clamp(x, 0, map.worldWidth - this.width - 1),
            clamp(y, 0, map.worldHeight - this.height - 1),
        ];

        if (smooth) {
            animateObject(this, { newX, newY, map, speed });
        } else {
            this.x = newX;
            this.y = newY;
        }
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
        } else if (this.speed) {
            animateObject(this, { time });
        }
    }
}

export default GameMapWindow;
