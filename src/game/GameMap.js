import { clamp } from '../engine/util';
import Cell from './Cell';
import GameMapWindow from './GameMapWindow';

class GameMap {
    constructor(game, engine, levelCfg) {
        this.game = game;
        this.engine = engine;
        this.height = levelCfg.map.length;
        this.width = levelCfg.map[0].length;
        this.levelCfg = levelCfg;
        this.window = new GameMapWindow(this, levelCfg.window);
        this.level = [];
        this.cellWidth = 0;
        this.cellHeight = 0;
        this.worldWidth = 0;
        this.worldHeight = 0;
        this.maxLayer = 0;
    }

    init() {
        const win = this.window.cfg;
        this.cellWidth = (this.engine.canvas.width / win.width) | 0;
        this.cellHeight = (this.engine.canvas.height / win.height) | 0;
        this.worldWidth = this.cellWidth * this.width;
        this.worldHeight = this.cellHeight * this.height;

        this.window.init();
        this.initMap(this.levelCfg);

        // this.window.focus(this.cell(win.x, win.y));
        // console.log(this.engine.canvas.height, win.height, this.cellHeight);
    }

    initMap(levelCfg) {
        const gameObjs = this.game.gameObjects;

        levelCfg.map.forEach((cfgRow, y) =>
            cfgRow.forEach((cfgCell, x) => {
                this.level[y] || (this.level[y] = []);
                const cell = (this.level[y][x] = new Cell(cfgCell, this, x, y));
            }),
        );
    }

    render(time, timeGap) {
        const level = this.level;
        const win = this.window;

        win.render(time, timeGap);

        const winBottomRight = win.worldPosition(100, 100);

        const startCell = win.startCell();
        const endCell = win.endCell();

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
