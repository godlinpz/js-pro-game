import Engine from '../engine/Engine';
import GameMap from './GameMap';
import levelCfg from './map.json';
import sprites from './sprites.json';

import playerCfg from './player/player.json';
import terrainCfg from './terrain/terrain.json';

class Game {
    constructor(id = 'game') {
        this.gameObjects = {};

        this.engine = new Engine(document.getElementById(id));
        this.map = new GameMap(this, this.engine, levelCfg);

        this.player = null;

        this.keys = {
            ArrowLeft: () => this.movePlayer(-1, 0),
            ArrowRight: () => this.movePlayer(1, 0),
            ArrowUp: () => this.movePlayer(0, -1),
            ArrowDown: () => this.movePlayer(0, 1),
        };

        this.engine
            .loadSprites(sprites)
            .then(() => {
                [playerCfg, terrainCfg].forEach((cfg) => this.loadGameObjects(cfg));

                this.map.init();

                this.engine.start(
                    () => this.onRender(),
                    (e) => this.onKeyDown(e),
                );
                return this;
            })
            .catch(() => alert('Error loading sprites!'));
    }

    setPlayer(player) {
        this.player = player;
    }

    loadGameObjects(objects) {
        this.gameObjects = { ...this.gameObjects, ...objects };
    }

    onRender(time, timeGap) {
        this.map.render(time, timeGap);
        // console.log(1);
    }

    onKeyDown(e) {
        // console.log(e);
        const player = this.player;

        if (player && !player.isMoving && this.keys[e.key]) this.keys[e.key]();
    }

    movePlayer(dx, dy) {
        const player = this.player;
        const cell = player.cell;
        const [newX, newY] = [cell.x + dx, cell.y + dy];
        const newCell = this.map.cell(newX, newY);

        if (newCell && newCell.filter((obj) => obj.cfg.name === 'grass').length) {
            // console.log();
            // console.log(newCell.objects);

            cell.remove(player);
            newCell.push(player);

            this.map.centerWindowAt(newX, newY);
        }
    }

    static init(id = 'game') {
        Game.game = new Game(id);
        console.log('INIT');
    }
}

export default Game;
