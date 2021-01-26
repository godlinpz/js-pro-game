import { clamp } from '../engine/util';
import ClientCell from './ClientCell';
import ClientMapWindow from './ClientMapWindow';

class ClientMap {
    constructor(game, engine, levelCfg) {
        Object.assign(this, {
            game,
            engine,
            levelCfg,
            height: levelCfg.map.length,
            width: levelCfg.map[0].length,
            window: new ClientMapWindow(Object.assign({ map: this }, levelCfg.window)),
            level: [],
            cellWidth: 0,
            cellHeight: 0,
            worldWidth: 0,
            worldHeight: 0,
            maxLayer: 0,
        });
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
            cfgRow.forEach((cellCfg, x) => {
                this.level[y] || (this.level[y] = []);
                this.level[y][x] = new ClientCell({ map: this, cellX: x, cellY: y, cellCfg });
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

export default ClientMap;
