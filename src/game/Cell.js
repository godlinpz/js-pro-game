class Cell {
    constructor(map, cellX, cellY) {
        this.map = map;
        this.cellX = cellX;
        this.cellY = cellY;
        this.x = cellX * this.map.cellWidth;
        this.y = cellY * this.map.cellHeight;

        this.objects = []; // GameObjects stack
    }

    /**
     * Координаты объекта в мире
     * @param {int} offset_percent_x Сдвиг относительно верхнего левого угла в процентах от размера объекта
     * @param {int} offset_percent_y Сдвиг относительно верхнего левого угла в процентах от размера объекта
     */
    worldPosition(offset_percent_x = 0, offset_percent_y = 0) {
        return {
            x: this.x + (this.map.cellWidth * offset_percent_x) / 100,
            y: this.y + (this.map.cellHeight * offset_percent_y) / 100,
        };
    }

    /**
     * Координаты объекта относительно окна отображения (канваса)
     * @param {int} offset_percent_x Сдвиг относительно верхнего левого угла в процентах от размера объекта
     * @param {int} offset_percent_y Сдвиг относительно верхнего левого угла в процентах от размера объекта
     */
    realPosition(offset_percent_x = 0, offset_percent_y = 0) {
        const map = this.map;
        return {
            x: this.x - map.window.x + (map.cellWidth * offset_percent_x) / 100,
            y: this.y - map.window.y + (map.cellHeight * offset_percent_y) / 100,
        };
    }

    render(time, timeGap) {
        this.objects.forEach((o) => o && o.render(time, timeGap));
    }

    push(obj) {
        obj.setCell(this);
        this.objects.push(obj);
        return obj;
    }

    remove(obj) {
        this.objects = this.objects.filter((o) => o !== obj);
        obj.setCell(null);
        return obj;
    }

    filter(callback) {
        return this.objects.filter(callback);
    }
}

export default Cell;
