import _ from 'lodash';
import GameObject from './GameObject';
import MovableObject from '../engine/MovableObject';

class Cell extends MovableObject {
    constructor(cfg) {
        super(cfg);
        const [width, height] = [cfg.map.cellWidth, cfg.map.cellHeight];

        Object.assign(this, {
            width,
            height,
            x: cfg.cellX * width,
            y: cfg.cellY * height,
            cellX: cfg.cellX,
            cellY: cfg.cellY,
            objects: [], // GameObjects stack
        });

        this.initCell();
    }

    createGameObject(objCfg) {
        return new GameObject(objCfg);
    }

    initCell() {
        const { cellCfg } = this;

        cellCfg.forEach((layer, level) =>
            layer.forEach((name) => {
                if (name) {
                    const obj = this.initCellObject(name, level);
                    if (name === 'spawn') this.addSpawnPoint(obj);
                }
            }),
        );
    }

    initCellObject(name, level) {
        const { map } = this;
        const gameObjs = map.game.gameObjects;

        const objCfg = _.cloneDeep(gameObjs[name]);
        _.assign(objCfg, {
            map,
            layer: level,
            cell: this,
            width: map.cellWidth,
            height: map.cellHeight,
        });

        const obj = this.createGameObject(objCfg);

        obj.moveToCell(this, false);

        return obj;
    }

    addSpawnPoint(obj) {
        this.map.game.addSpawnPoint(obj);

        return obj;
    }

    render(layer, time, timeGap) {
        const objs = this.objects;
        if (objs[layer] && objs[layer].length) {
            objs[layer].forEach((o) => o && o.render(time, timeGap));
        }
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

        objs[obj.layer] && (objs[obj.layer] = objs[obj.layer].filter((o) => o !== obj));

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
