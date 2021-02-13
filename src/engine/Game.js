import GameStates from './GameStates';
import levelCfg from '../configs/maps/map.json';
import GameMap from './GameMap';
import Engine from '../engine/Engine';
import sprites from '../configs/sprites/sprites.json';
import _ from 'lodash';

class Game {
    constructor(cfg) {
        Object.assign(this, cfg);

        this.cfg = cfg;
        this.gameObjects = {};
        this.spawnPoints = [];
        this.players = {};

        this.state = GameStates.start;

        this.api = this.createApi(cfg);
        this.api.connect();

        this.engine = this.createEngine();
        this.map = this.createMap(levelCfg);
        this.onCreate();
        this.initEngine();
    }

    createApi(cfg) {
        // return new Api();
        return { connect: () => {} };
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

    initEngine() {
        this.engine
            .loadSprites(sprites)
            .then(() => this.onEngineReady())
            .catch((e) => console.error('Init engine error!', e));
    }

    setState(state) {
        this.state = state;
    }

    addSpawnPoint(spawnPoint) {
        this.spawnPoints.push(spawnPoint);
    }

    setPlayers(playersList) {
        _.forOwn(playersList, (player) => this.createPlayer(player));
    }

    createPlayer({ id, cellX, cellY, layer, skin, name }) {
        if (!this.players[id]) {
            // console.log({ id, cellX, cellY, layer, skin });
            try {
                const cell = this.map.cell(cellX, cellY);
                const playerObj = cell.initCellObject(skin, layer);
                playerObj.playerId = id;
                playerObj.skin = skin;
                playerObj.playerName = name;

                this.players[id] = playerObj;
            } catch (e) {
                console.error(e);
                console.log(id, cellX, cellY, layer, skin, name);
            }
        }

        return this.players[id];
    }

    getPlayersList() {
        const list = [];
        _.forOwn(this.players, (player, id) => {
            const { layer, skin, playerName } = player;
            const { cellX, cellY } = player.cell;
            list.push({ id, layer, cellX, cellY, skin, name: playerName });
        });
        // console.log('getPlayersList', list);
        return list;
    }

    removePlayer(id) {
        const player = this.getPlayerById(id);
        if (player) {
            player.detouch();
            delete this.players[id];
        }
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

    getRandomSkin() {
        return _.sample(_.keys(sprites.characters));
    }

    getPlayerById(id) {
        return this.players[id];
    }

    offsetToDirection(dx, dy) {
        return (dx > 0 && 'right') || (dx < 0 && 'left') || (dy > 0 && 'down') || (dy < 0 && 'up') || '';
    }

    directionToOffset(direction) {
        return {
            right: [1, 0],
            left: [-1, 0],
            down: [0, 1],
            up: [0, -1],
        }[direction];
    }

    meetPlayers(player, player2) {}

    movePlayerTo(newX, newY, player) {
        if (player) {
            const newCell = this.map.cell(newX, newY);
            const [player2] = newCell.filter(({ playerName }) => playerName);
            // console.log('MEET', player, player2);
            if (player2) {
                this.meetPlayers(player, player2);
            } else if (newCell && newCell.filter(({ cfg: { name } }) => name === 'grass').length) {
                const { cellX: oldX, cellY: oldY } = player.cell;
                player.moveToCell(newCell);
                return { x: newCell.cellX, y: newCell.cellY, oldX, oldY };
            }
        }
        return false;
    }

    movePlayerBy(dx, dy, player = null) {
        player = player || this.player;
        if (player) {
            const cell = player.cell;
            const [newX, newY] = [cell.cellX + dx, cell.cellY + dy];
            return this.movePlayerTo(newX, newY, player);
        }
    }
}

export default Game;
