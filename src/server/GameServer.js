import ServerEngine from './ServerEngine';
import ServerMap from './ServerMap';
import sprites from '../configs/sprites/sprites.json';

import playerCfg from '../configs/objects/player.json';
import terrainCfg from '../configs/objects/terrain.json';
import ServerApi from './ServerApi';

import Game from '../engine/Game';
import GameStates from '../engine/GameStates';

import _ from 'lodash';

class GameServer extends Game {
    constructor(cfg) {
        super(cfg);
    }

    onCreate() {}

    createApi(cfg) {
        return new ServerApi({ game: this, ...cfg });
    }

    createEngine() {
        return new ServerEngine();
    }

    createMap(levelCfg) {
        return new ServerMap(this, this.engine, levelCfg);
    }

    getRandomSpawnPoint() {
        const spawn = _.sample(this.spawnPoints);
        const { cellX, cellY } = spawn.cell;
        const layer = spawn.layer + 1;
        return { cellX, cellY, layer };
    }

    getLastRenderTime() {
        return this.engine.lastRenderTime;
    }

    initEngine() {
        this.engine
            .loadSprites(sprites)
            .then(() => this.onEngineReady())
            .catch((e) => console.error('Init engine error!', e));
    }

    initHandlers() {
        const engine = this.engine;

        [
            ['render', 'onRender'],
            ['prerender', 'onPreRender'],
        ].forEach(([e, handler]) => engine.on(e, (_, data) => this[handler].apply(this, [data])));
    }

    onEngineReady() {
        [playerCfg, terrainCfg].forEach((cfg) => this.loadGameObjects(cfg));

        this.map.init();
        this.initHandlers();
        this.engine.start();

        return this;
    }

    onRender([time, timeGap]) {
        this.checkInput();

        super.onRender([time, timeGap]);
    }

    checkInput() {
        /*
        if (this.engine.keysPressed.size) {
            for (let key of Array.from(this.engine.keysPressed))
                if (this.keys[key]) {
                    this.keys[key]();
                    break;
                }
        }
        */
    }

    pauseGame() {
        this.engine[(this.engine.pausedAt ? 'un' : '') + 'pause']();
        this.setState(this.engine.pausedAt ? GameStates.pause : GameStates.play);
    }

    static init() {
        GameServer.game = new GameServer({});
        console.log('INIT');
    }
}

export default GameServer;
