import _ from 'lodash';
import ClientGameObject from './ClientGameObject';
import Cell from '../models/Cell';

class ClientCell extends Cell {
    constructor(cfg) {
        super(cfg);
    }

    createGameObject(objCfg) {
        return new ClientGameObject(objCfg);
    }

    initPlayer(name, level) {
        const obj = this.initCellObject(name, level);
        super.initPlayer(name, level);

        const { game, window } = this.map;

        game.setPlayer(obj);
        window.follow(obj);
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
}

export default ClientCell;
