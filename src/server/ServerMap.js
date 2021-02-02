import ServerCell from './ServerCell';
import GameMap from '../engine/GameMap';

class ServerMap extends GameMap {
    constructor(game, engine, levelCfg) {
        super(game, engine, levelCfg);

        // Object.assign(this, {
        // });
    }

    createCell(cfg) {
        return new ServerCell(cfg);
    }
}

export default ServerMap;
