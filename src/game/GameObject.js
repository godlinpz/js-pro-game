// This class is abstract

class GameObject {
    constructor(cfg, cell = null) {
        cfg.state = cfg.state || 'main';

        this.cfg = cfg;
        this.cell = cell;
    }

    render({ x, y, w, h }, time, timeGap) {
        const ctx = this.cell.map.engine.ctx;
        const color = {
            grass: 'green',
            wall: 'black',
            player: 'red',
        }[this.cfg.name];

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
}

export default GameObject;
