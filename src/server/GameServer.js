import ServerEngine from './ServerEngine';
import ServerMap from './ServerMap';
import sprites from '../configs/sprites/sprites.json';

import playerCfg from '../configs/objects/player.json';
import terrainCfg from '../configs/objects/terrain.json';
import ServerApi from './ServerApi';

import Game from '../engine/Game';
import GameStates from '../engine/GameStates';

class GameServer extends Game {
    constructor(cfg) {
        super(cfg);
    }

    onCreate() {}

    createApi(cfg) {
        return new ServerApi(cfg);
    }

    createEngine() {
        return new ServerEngine();
    }

    createMap(levelCfg) {
        return new ServerMap(this, this.engine, levelCfg);
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

    movePlayer(dx, dy) {
        const player = this.player;

        if (player && !player.speed) {
            const cell = player.cell;
            const [newX, newY] = [cell.cellX + dx, cell.cellY + dy];
            const newCell = this.map.cell(newX, newY);

            if (newCell && newCell.filter((obj) => obj.cfg.name === 'grass').length) {
                player.moveToCell(newCell);
                const state =
                    (dx > 0 && 'right') || (dx < 0 && 'left') || (dy > 0 && 'down') || (dy < 0 && 'up') || 'main';
                player.setState(state);
                player.once('animation-stopped', () => player.setState('main', 100));
                this.map.window.focus(player);
            }
        }
    }

    static init() {
        GameServer.game = new GameServer({});
        console.log('INIT');
    }
}

export default GameServer;
