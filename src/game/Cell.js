import _ from 'lodash';
import GameObject from './GameObject';

class Cell {
    constructor(cfg, map, cellX, cellY) {
        this.map = map;
        this.cellX = cellX;
        this.cellY = cellY;
        this.x = cellX * this.map.cellWidth;
        this.y = cellY * this.map.cellHeight;
        this.cfg = cfg;

        this.objects = []; // GameObjects stack

        this.initCell();
    }

    initCell() {
        const { cfg, map } = this;
        const gameObjs = map.game.gameObjects;

        cfg.forEach((layer, level) =>
            layer.forEach((name) => {
                const objCfg = _.cloneDeep(gameObjs[name]);
                objCfg.layer = level;
                const obj = new GameObject(objCfg);

                obj.moveToCell(this, false);

                if (name === 'player') {
                    map.game.setPlayer(obj);
                    map.window.follow(obj);
                }
            }),
        );
    }

    /**
     * Координаты объекта в мире
     * @param {int} offset_percent_x Сдвиг относительно верхнего левого угла в процентах от размера объекта
     * @param {int} offset_percent_y Сдвиг относительно верхнего левого угла в процентах от размера объекта
     */
    worldPosition(offset_percent_x = 0, offset_percent_y = 0) {
        return {
            x: this.x + (this.map.cellWidth * offset_percent_x) / 100,
            y: this.y + (this.map.cellHeight * offset_percent_y) / 100,
        };
    }

    /**
     * Координаты объекта относительно окна отображения (канваса)
     * @param {int} offset_percent_x Сдвиг относительно верхнего левого угла в процентах от размера объекта
     * @param {int} offset_percent_y Сдвиг относительно верхнего левого угла в процентах от размера объекта
     */
    realPosition(offset_percent_x = 0, offset_percent_y = 0) {
        const map = this.map;
        return {
            x: this.x - map.window.x + (map.cellWidth * offset_percent_x) / 100,
            y: this.y - map.window.y + (map.cellHeight * offset_percent_y) / 100,
        };
    }

    render(layer, time, timeGap) {
        const objs = this.objects;
        if (objs[layer] && objs[layer].length)
            objs.forEach((layer) => layer.forEach((o) => o && o.render(time, timeGap)));
    }

    push(obj) {
        const objs = this.objects;
        obj.setCell(this);

        objs[obj.layer] || (objs[obj.layer] = []);

        objs[obj.layer].push(obj);

        return obj;
    }

    remove(obj) {
        const objs = this.objects;
        objs[obj.layer] = objs[obj.layer].filter((o) => o !== obj);

        obj.setCell(null);
        return obj;
    }

    filter(callback) {
        return this.objects
            .map((l) => l.filter(callback))
            .filter((l) => l.length)
            .flat();
    }
}

export default Cell;
