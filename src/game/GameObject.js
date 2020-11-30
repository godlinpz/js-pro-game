// This class is abstract

class GameObject {
    constructor(cfg, cell = null) {
        Object.assign(this, cfg);

        this.cfg = cfg;

        this.state = this.state || 'main';
        this.size = cfg.size || 100;
        this.spriteSize = cfg.spriteSize || 80;

        this.cell = cell;
        this.isMoving = false;

        Object.assign(this, cell ? cell.worldPosition() : { x: 0, y: 0 });
    }

    /**
     * Координаты объекта в мире
     * @param {int} offset_percent_x Сдвиг относительно верхнего левого угла в процентах от размера объекта
     * @param {int} offset_percent_y Сдвиг относительно верхнего левого угла в процентах от размера объекта
     */
    worldPosition(offset_percent_x = 0, offset_percent_y = 0) {
        const cell = this.cell;
        const map = this.cell.map;
        return {
            x: this.x + (cell ? (map.cellWidth * offset_percent_x) / 100 : 0),
            y: this.y + (cell ? (map.cellHeight * offset_percent_y) / 100 : 0),
        };
    }

    /**
     * Координаты объекта относительно окна отображения (канваса)
     * @param {int} offset_percent_x Сдвиг относительно верхнего левого угла в процентах от размера объекта
     * @param {int} offset_percent_y Сдвиг относительно верхнего левого угла в процентах от размера объекта
     */
    realPosition(offset_percent_x = 0, offset_percent_y = 0) {
        const win = this.cell.map.window;
        const pos = this.worldPosition(offset_percent_x, offset_percent_y);

        return {
            x: pos.x - win.x,
            y: pos.y - win.y,
        };
    }

    render(time, timeGap) {
        const map = this.cell.map;
        const ctx = this.cell.map.engine.ctx;
        const cell = this.cell;

        const pos = this.realPosition();

        const [x, y, w, h] = [pos.x, pos.y, map.cellWidth, map.cellHeight];

        // if(Math.random() < 0.001)
        // console.log('render', x, y, w, h);

        const color = {
            grass: 'green',
            wall: 'black',
            player: 'red',
        }[this.name];

        ctx.fillStyle = color;

        ctx.fillRect(x, y, w, h);

        ctx.strokeStyle = '#6262624d';
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(x + w, y);
        ctx.stroke();

        // inherit to render
        return [time, timeGap];
    }

    setCell(cell) {
        this.cell = cell;
    }

    moveTo(x, y, smooth = true, speed = 300) {
        this.x = x;
        this.y = y;
    }

    moveToCell(cell, smooth = true, speed = 300) {
        if (this.cell) this.cell.remove(this);

        cell.push(this);
        this.moveTo(cell.x, cell.y, smooth, speed);
    }
}

export default GameObject;
