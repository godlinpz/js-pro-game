import { clamp } from '../engine/util';
import _ from 'lodash';
import Cell from './Cell';
import GameObject from './GameObject';

class GameMap {
    constructor(game, engine, levelCfg) {
        this.game = game;
        this.engine = engine;
        this.height = levelCfg.map.length;
        this.width = levelCfg.map[0].length;
        this.levelCfg = levelCfg;
        this.window = levelCfg.window;
        this.level = [];
        this.cellWidth = 0;
        this.cellHeight = 0;
    }

    init() {
        const win = this.window;
        this.initMap(this.levelCfg);
        this.cellWidth = (this.engine.canvas.width / win.width) | 0;
        this.cellHeight = (this.engine.canvas.height / win.height) | 0;
        this.moveWindowTo(win.x, win.y);
        console.log(this.engine.canvas.height, win.height, this.cellHeight);
    }

    initMap(levelCfg) {
        const gameObjs = this.game.gameObjects;

        levelCfg.map.forEach((cfgRow, y) =>
            cfgRow.forEach((cfgCell, x) => {
                this.level[y] || (this.level[y] = []);
                const cell = (this.level[y][x] = new Cell(this, x, y));

                cfgCell.forEach((name) => {
                    const objCfg = _.cloneDeep(gameObjs[name]);
                    const obj = new GameObject(objCfg);

                    cell.push(obj);
                    if (name === 'player') this.game.setPlayer(obj);
                });
            }),
        );
    }

    render(time, timeGap) {
        const eng = this.engine;
        const ctx = this.engine.ctx;
        const level = this.level;
        const win = this.window;
        // console.log(map);
        const [cellW, cellH] = [this.cellWidth, this.cellHeight];

        for (let y = 0; y < win.height; ++y)
            for (let x = 0; x < win.width; ++x) {
                const cell = level[y + win.y][x + win.x];
                const cellX = x * cellW,
                    cellY = y * cellH;

                cell.render({ x: cellX, y: cellY, w: cellW, h: cellH }, time, timeGap);
            }
    }

    moveWindow(dx, dy) {
        const win = this.window;
        this.moveWindowTo(win.x + dx, win.y + dy);
    }

    moveWindowTo(x, y) {
        const win = this.window;

        win.x = clamp(x, 0, this.width - win.width);
        win.y = clamp(y, 0, this.height - win.height);
    }

    centerWindowAt(x, y) {
        const win = this.window;
        this.moveWindowTo(x - ((win.width / 2) | 0), y - ((win.height / 2) | 0));
    }

    cell(x, y) {
        return this.level[y] && this.level[y][x];
    }
}

export default GameMap;
