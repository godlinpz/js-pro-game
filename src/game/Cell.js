class Cell {
    constructor(map, x, y) {
        this.map = map;
        this.x = x;
        this.y = y;

        this.objects = []; // GameObjects stack
    }

    render(window, time, timeGap) {
        const w = this.map.cellWidth;
        const h = this.map.cellHeight;
        const x = (this.x - window.x) * w;
        const y = (this.y - window.y) * h;

        this.objects.forEach((o) => o && o.render({ x, y, w, h }, time, timeGap));
    }

    push(obj) {
        obj.cell = this;
        this.objects.push(obj);
        return obj;
    }

    remove(obj) {
        this.objects = this.objects.filter((o) => o !== obj);
        return obj;
    }

    filter(callback) {
        return this.objects.filter(callback);
    }
}

export default Cell;
