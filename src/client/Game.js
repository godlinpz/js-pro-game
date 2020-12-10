import Engine from '../engine/Engine';
import GameMap from './GameMap';
import levelCfg from '../configs/maps/map.json';
import sprites from '../configs/sprites/sprites.json';

import playerCfg from '../configs/objects/player.json';
import terrainCfg from '../configs/objects/terrain.json';
import Api from './Api';

const GameStates = {
    start: Symbol('start'),
    play: Symbol('play'),
    pause: Symbol('pause'),
};

class Game {
    constructor(id = 'game') {
        this.gameObjects = {};
        this.player = null;

        this.engine = new Engine(document.getElementById(id));
        this.map = new GameMap(this, this.engine, levelCfg);

        this.state = GameStates.start;

        this.api = new Api();
        this.api.connect();

        this.initKeys();
        this.initEngine();
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
            .catch((e) => console.log('Init engine error!', e));
    }

    onEngineReady() {
        [playerCfg, terrainCfg].forEach((cfg) => this.loadGameObjects(cfg));

        this.map.init();
        const engine = this.engine;
        [
            ['keydown', 'onKeyDown'],
            ['keyup', 'onKeyUp'],
            ['mousedown', 'onMouseDown'],
            ['mouseup', 'onMouseUp'],
            ['render', 'onRender'],
            ['prerender', 'onPreRender'],
        ].forEach(([e, handler]) => engine.on(e, (_, data) => this[handler].apply(this, [data])));

        this.engine.start();

        return this;
    }

    setPlayer(player) {
        this.player = player;
    }

    loadGameObjects(objects) {
        this.gameObjects = { ...this.gameObjects, ...objects };
    }

    onPreRender([time, timeGap]) {}

    onRender([time, timeGap]) {
        if (this.engine.keysPressed.size) {
            for (let key of Array.from(this.engine.keysPressed))
                if (this.keys[key]) {
                    this.keys[key]();
                    break;
                }
        }

        try {
            this.map.render(time, timeGap);
        } catch (e) {
            console.log('RENDER ERROR', e);
        }

        if (this.state === GameStates.start) {
            const ctx = this.engine.ctx;

            ctx.fillStyle = 'black';
            ctx.fillRect(200, 200, 200, 200);

            ctx.fillStyle = 'orange';
            ctx.fillRect(210, 210, 180, 180);

            ctx.fillStyle = 'black';

            ctx.font = '48px sans-serif';
            ctx.fillText('START', 225, 315);
        }
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

    setState(state) {
        this.state = state;
    }

    static init(id = 'game') {
        Game.game = new Game(id);
        console.log('INIT');
    }
}

export default Game;
