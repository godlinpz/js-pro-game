import _ from 'lodash';
import ServerGameObject from './ServerGameObject';
import Cell from '../models/Cell';

class ServerCell extends Cell {
    constructor(cfg) {
        super(cfg);
    }

    createGameObject(objCfg) {
        return new ServerGameObject(objCfg);
    }

    initPlayer(name, level) {
        const obj = super.initPlayer(name, level);

        const { game, window } = this.map;

        game.setPlayer(obj);
        window.follow(obj);
    }
}

export default ServerCell;
