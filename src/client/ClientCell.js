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

    addSpawnPoint(spawnPoint) {
        super.addSpawnPoint(spawnPoint);

        return spawnPoint;
    }
}

export default ClientCell;
