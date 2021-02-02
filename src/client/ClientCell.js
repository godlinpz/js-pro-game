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

        const { game, window } = this.map;
        if (game.spawnPoints.length === 1) {
            const player = this.initCellObject('player', spawnPoint.layer + 1);
            game.setPlayer(player);
            window.follow(player);
        }

        return spawnPoint;
    }
}

export default ClientCell;
