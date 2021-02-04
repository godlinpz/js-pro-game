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

    createPlayer({ id, cellX, cellY, layer, skin }) {
        if (!this.players[id]) {
            // console.log({ id, cellX, cellY, layer, skin });
            const cell = this.map.cell(cellX, cellY);
            const playerObj = cell.initCellObject(skin, layer);
            playerObj.playerId = id;
            playerObj.skin = skin;

            this.players[id] = playerObj;
        }

        return this.players[id];
    }

    getPlayersList() {
        const list = [];
        _.forOwn(this.players, (player, id) => {
            const { layer, skin } = player;
            const { cellX, cellY } = player.cell;
            list.push({ id, layer, cellX, cellY, skin });
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

    movePlayer(dx, dy, player) {
        if (player) {
            const cell = player.cell;
            const [newX, newY] = [cell.cellX + dx, cell.cellY + dy];
            const newCell = this.map.cell(newX, newY);

            if (newCell && newCell.filter((obj) => obj.cfg.name === 'grass').length) {
                player.moveToCell(newCell);
                return true;
            }
        }
    }
}

export default Game;
