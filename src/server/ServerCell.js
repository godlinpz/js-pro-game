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
}

export default ServerCell;
