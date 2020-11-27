import { clamp } from '../engine/util';

class GameMap {
    constructor(engine, mapData) {
        this.engine = engine;
        this.map = mapData;
        this.height = mapData.map.length;
        this.width = mapData.map[0].length;
    }

    render() {
        const eng = this.engine;
        const ctx = this.engine.ctx;
        const map = this.map.map;
        const win = this.map.window;
        // console.log(map);
        const [cellW, cellH] = [
            (this.engine.canvas.width / win.width) | 0,
            (this.engine.canvas.height / win.height) | 0,
        ];

        for (let y = 0; y < win.height; ++y)
            for (let x = 0; x < win.width; ++x) {
                // console.log('TEST');
                // console.log(y + win.y, x + win.x)
                const cell = map[y + win.y][x + win.x];
                ctx.fillStyle = cell ? 'black' : 'green';
                ctx.fillRect(x * cellW, y * cellH, cellW - 1, cellH - 1);
            }
    }

    move(dx, dy) {
        const win = this.map.window;
        const map = this.map.map;

        win.x = clamp(win.x + dx, 0, this.width - win.width);
        win.y = clamp(win.y + dy, 0, this.height - win.height);

        // console.log(win.x + dx, map.width  - win.width  - 1);
        // console.log(win);
    }
}

export default GameMap;
