import { clamp } from '../engine/util';
import Cell from '../models/Cell';
import _ from 'lodash';
import EventSourceMixin from '../engine/EventSourceMixin';

class GameMap {
    constructor(game, engine, levelCfg) {
        Object.assign(this, {
            game,
            engine,
            levelCfg,
            height: levelCfg.map.length,
            width: levelCfg.map[0].length,
            level: [],
            cellWidth: 100,
            cellHeight: 100,
            worldWidth: 0,
            worldHeight: 0,
            layers: [],
            maxLayer: 0,
        });
    }

    createCell(cfg) {
        return new Cell(cfg);
    }

    init() {
        this.worldWidth = this.cellWidth * this.width;
        this.worldHeight = this.cellHeight * this.height;

        this.initMap(this.levelCfg);
    }

    initMap(levelCfg) {
        const gameObjs = this.game.gameObjects;

        this.layers = _.cloneDeep(levelCfg.layers);

        levelCfg.map.forEach((cfgRow, y) =>
            cfgRow.forEach((cellCfg, x) => {
                this.level[y] || (this.level[y] = []);
                this.level[y][x] = this.createCell({ map: this, cellX: x, cellY: y, cellCfg });
            }),
        );

        this.trigger('init');
    }

    getRenderRange() {
        return { startCell: this.cell(0, 0), endCell: this.cell(this.width - 1, this.height - 1) };
    }

    render(time, timeGap) {
        const range = this.getRenderRange();

        for (let layerId = 0; layerId < this.layers.length; ++layerId) this.renderLayer(time, timeGap, layerId, range);
    }

    renderLayer(time, timeGap, layerId, { startCell, endCell }) {
        for (let y = startCell.cellY; y <= endCell.cellY; ++y)
            for (let x = startCell.cellX; x <= endCell.cellX; ++x) {
                const cell = this.cell(x, y);
                cell.render(layerId, time, timeGap);
            }
    }

    cell(cellX, cellY) {
        return this.level[cellY] && this.level[cellY][cellX];
    }

    cellAt(x, y) {
        return this.cell(
            clamp((x / this.cellWidth) | 0, 0, this.width - 1),
            clamp((y / this.cellHeight) | 0, 0, this.height - 1),
        );
    }
}

Object.assign(GameMap.prototype, EventSourceMixin);

export default GameMap;
