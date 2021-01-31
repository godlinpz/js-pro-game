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

        this.players = null;
    }

    onCreate() {
        this.initKeys();
    }

    createApi() {
        return new ServerApi();
    }

    createEngine() {
        return new ServerEngine(document.getElementById(this.cfg.tagId));
    }

    createMap(levelCfg) {
        return new ServerMap(this, this.engine, levelCfg);
    }

    getLastRenderTime() {
        return this.engine.lastRenderTime;
    }

    initKeys() {
        this.keys = {
            ArrowLeft: () => this.movePlayer(-1, 0),
            ArrowRight: () => this.movePlayer(1, 0),
            ArrowUp: () => this.movePlayer(0, -1),
            ArrowDown: () => this.movePlayer(0, 1),
        };
        this.keysOnce = {
            Space: (pressed) => pressed && this.pauseGame(),
        };
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
            ['keydown', 'onKeyDown'],
            ['keyup', 'onKeyUp'],
            ['mousedown', 'onMouseDown'],
            ['mouseup', 'onMouseUp'],
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

    setPlayer(player) {
        this.player = player;
    }

    onRender([time, timeGap]) {
        this.checkInput();

        super.onRender([time, timeGap]);

        if (this.state === GameStates.start) this.renderStartBar();
    }

    checkInput() {
        if (this.engine.keysPressed.size) {
            for (let key of Array.from(this.engine.keysPressed))
                if (this.keys[key]) {
                    this.keys[key]();
                    break;
                }
        }
    }

    renderStartBar() {
        const ctx = this.engine.ctx;

        ctx.fillStyle = 'black';
        ctx.fillRect(200, 200, 200, 200);

        ctx.fillStyle = 'orange';
        ctx.fillRect(210, 210, 180, 180);

        ctx.fillStyle = 'black';

        ctx.font = '48px sans-serif';
        ctx.fillText('START', 225, 315);
    }

    // onKeyDown({ key }) {
    onKeyDown({ code }) {
        // console.log('KEY DOWN', code);
        this.keysOnce[code] && this.keysOnce[code](true);
    }

    onKeyUp({ code }) {
        // console.log('KEY UP', key);
        this.keysOnce[code] && this.keysOnce[code](false);
    }

    onMouseDown(e) {
        // console.log('MOUSE DOWN', e);
        this.setState(GameStates.play);
    }

    onMouseUp(e) {
        // console.log('MOUSE UP', e);
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

    static init(tagId = 'game') {
        GameServer.game = new GameServer({ tagId });
        console.log('INIT');
    }
}

export default GameServer;
