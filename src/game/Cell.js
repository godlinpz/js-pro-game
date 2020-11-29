class Cell {
    constructor(map, x, y) {
        this.map = map;
        this.x = x;
        this.y = y;

        this.objects = []; // GameObjects stack
    }

    render(position, time, timeGap) {
        this.objects.forEach((o) => o && o.render(position, time, timeGap));
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
