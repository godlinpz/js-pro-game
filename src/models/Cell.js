import _ from 'lodash';
import GameObject from './GameObject';

class Cell {
    constructor(cfg, map, cellX, cellY) {
        Object.assign(this, {
            map: map,
            cellX: cellX,
            cellY: cellY,
            x: cellX * map.cellWidth,
            y: cellY * map.cellHeight,
            cfg: cfg,
            objects: [], // GameObjects stack
            spawnPoints: [],
        });
        this.initCell();
    }

    createGameObject(objCfg) {
        return new GameObject(objCfg);
    }

    initCell() {
        const { cfg, map } = this;

        cfg.forEach((layer, level) =>
            layer.forEach((name) => {
                if (name === 'player') this.initPlayer(name, level);
                else this.initCellObject(name, level);
            }),
        );
    }

    initCellObject(name, level) {
        const { map } = this;
        const gameObjs = map.game.gameObjects;

        const objCfg = _.cloneDeep(gameObjs[name]);
        objCfg.layer = level;
        const obj = this.createGameObject(objCfg);

        obj.moveToCell(this, false);

        return obj;
    }

    initPlayer(name, level) {
        this.spawnPoints.push([this.cellX, this.cellY]);
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
