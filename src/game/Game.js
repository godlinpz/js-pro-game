import Engine from '../engine/Engine';
import GameMap from './GameMap';
import levelCfg from './map.json';
import sprites from './sprites.json';

import playerCfg from './player/player.json';
import terrainCfg from './terrain/terrain.json';

class Game {
    constructor(id = 'game') {
        this.gameObjects = {};
        this.player = null;

        this.engine = new Engine(document.getElementById(id));
        this.map = new GameMap(this, this.engine, levelCfg);

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
        this.keysPressed = new Set();
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

        this.engine.start(this.onRender.bind(this), this.onKeyDown.bind(this), this.onKeyUp.bind(this));
        return this;
    }

    setPlayer(player) {
        this.player = player;
    }

    loadGameObjects(objects) {
        this.gameObjects = { ...this.gameObjects, ...objects };
    }

    onRender(time, timeGap) {
        if (this.keysPressed.size) {
            // console.log(this.keysPressed);
            this.keys[Array.from(this.keysPressed)[0]]();
        }

        this.map.render(time, timeGap);
    }

    onKeyDown({ key }) {
        console.log('KEY DOWN', key);
        this.keys[key] && this.keysPressed.add(key);
    }

    onKeyUp({ key }) {
        console.log('KEY UP', key);
        this.keys[key] && this.keysPressed.delete(key);
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

    static init(id = 'game') {
        Game.game = new Game(id);
        console.log('INIT');
    }
}

export default Game;
