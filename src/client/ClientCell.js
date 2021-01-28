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
        const obj = super.initPlayer(name, level);

        const { game, window } = this.map;

        game.setPlayer(obj);
        window.follow(obj);
    }
}

export default ClientCell;
