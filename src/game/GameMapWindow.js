import { clamp } from '../engine/util';

class GameMapWindow {
    constructor(map, cfg) {
        Object.assign(this, cfg);
        this.map = map;
        this.cfg = cfg;

        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
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

    moveTo(x, y) {
        const map = this.map;
        this.x = clamp(x, 0, map.worldWidth - this.width - 1);
        this.y = clamp(y, 0, map.worldHeight - this.height - 1);

        console.log('moveTo', x, y, this.x);
    }

    focus(obj) {
        // сфокусироваться можно только на тех, у кого есть метод worldPosition
        const pos = obj.worldPosition(50, 50);
        // console.log('map focus', pos.x, this.width, pos.y, this.height);
        this.moveTo(pos.x - this.width / 2, pos.y - this.height / 2);
        console.log('map focus', this.x, this.y);
        // console.log('map after focus');
    }
}

export default GameMapWindow;
