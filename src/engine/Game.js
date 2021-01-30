import GameStates from './GameStates';
import levelCfg from '../configs/maps/map.json';
import GameMap from './GameMap';
import Engine from '../engine/Engine';

class Game {
    constructor(cfg) {
        Object.assign(this, cfg);

        this.cfg = cfg;
        this.gameObjects = {};
        this.state = GameStates.start;

        this.engine = this.createEngine();
        this.map = this.createMap(levelCfg);
        this.onCreate();
        this.initEngine();
    }

    onCreate() {}

    createEngine() {
        return new Engine();
    }

    createMap(levelCfg) {
        return new GameMap(this, levelCfg);
    }

    loadGameObjects(objects) {
        this.gameObjects = { ...this.gameObjects, ...objects };
    }

    setState(state) {
        this.state = state;
    }

    onPreRender([time, timeGap]) {}

    onRender([time, timeGap]) {
        try {
            this.map.render(time, timeGap);
        } catch (e) {
            console.log('RENDER ERROR', e);
        }
    }

    getLastRenderTime() {
        return 0;
    }
}

export default Game;
