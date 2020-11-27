import Engine from '../engine/Engine';
import GameMap from './GameMap';
import mapData from './map.json';

class Game {
    constructor(id = 'game') {
        this.engine = new Engine(document.getElementById(id));
        this.map = new GameMap(this.engine, mapData);

        this.engine.start(
            () => this.onRender(),
            (e) => this.onKeyDown(e),
        );
    }

    onRender() {
        this.map.render();
        // console.log(1);
    }

    onKeyDown(e) {
        // console.log(e);
        ({
            ArrowLeft: () => this.map.move(-1, 0),
            ArrowRight: () => this.map.move(1, 0),
            ArrowUp: () => this.map.move(0, -1),
            ArrowDown: () => this.map.move(0, 1),
        }[e.key]());
    }

    static init(id = 'game') {
        Game.game = new Game(id);
        console.log('INIT');
    }
}

export default Game;
