import { clamp } from '../engine/util';
import Cell from '../models/Cell';

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

        levelCfg.map.forEach((cfgRow, y) =>
            cfgRow.forEach((cellCfg, x) => {
                this.level[y] || (this.level[y] = []);
                this.level[y][x] = this.createCell({ map: this, cellX: x, cellY: y, cellCfg });
            }),
        );
    }

    getRenderRange() {
        return { startCell: this.cell(0, 0), endCell: this.cell(this.width - 1, this.height - 1) };
    }

    render(time, timeGap) {
        const { startCell, endCell } = this.getRenderRange();

        let maxLayers = 1;

        for (let layer = 0; layer < maxLayers; ++layer)
            for (let y = startCell.cellY; y <= endCell.cellY; ++y)
                for (let x = startCell.cellX; x <= endCell.cellX; ++x) {
                    const cell = this.cell(x, y);
                    cell.render(layer, time, timeGap);

                    if (maxLayers < cell.objects.length) maxLayers = cell.objects.length;
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

export default GameMap;
