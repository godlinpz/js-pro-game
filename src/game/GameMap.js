import { clamp } from '../engine/util';
import _ from 'lodash';
import Cell from './Cell';
import GameObject from './GameObject';
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
                const cell = (this.level[y][x] = new Cell(this, x, y));

                // console.log('map cell', cell);

                cfgCell.forEach((name) => {
                    const objCfg = _.cloneDeep(gameObjs[name]);
                    const obj = new GameObject(objCfg);

                    obj.moveToCell(cell, false);
                    // cell.push(obj);

                    if (name === 'player') {
                        this.game.setPlayer(obj);
                        this.window.focus(obj);
                    }
                });
            }),
        );
    }

    render(time, timeGap) {
        const level = this.level;
        const win = this.window;
        const winBottomRight = win.worldPosition(100, 100);

        const startCell = win.startCell();
        const endCell = win.endCell();

        for (let y = startCell.cellY; y <= endCell.cellY; ++y)
            for (let x = startCell.cellX; x <= endCell.cellX; ++x) {
                const cell = this.cell(x, y);
                cell.render(time, timeGap);
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
