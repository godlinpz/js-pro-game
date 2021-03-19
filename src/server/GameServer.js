import ServerEngine from './ServerEngine';
import ServerMap from './ServerMap';
// import sprites from '../configs/sprites/sprites.json';

import playerCfg from '../configs/objects/player.json';
import terrainCfg from '../configs/objects/terrain.json';
import ServerApi from './ServerApi';

import Game from '../engine/Game';
import GameStates from '../engine/GameStates';

import _ from 'lodash';

class GameServer extends Game {
    constructor(cfg) {
        super(cfg);

        this.fightPairings = {};
        this.fights = {};
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

    meetPlayers(player, player2) {
        this.api.meetPlayers(player, player2);
    }

    getPair(player, enemy) {
        let pairId = [player.playerId, enemy.playerId].sort().join('--');
        let pairInfo = this.fightPairings[pairId];

        if (pairInfo && pairInfo.time + 7 * 60 * 1000 < Date.now()) {
            delete this.fightPairings[pairId];
            pairId = false;
            pairInfo = false;
        }

        return { info: pairInfo, id: pairId };
    }

    agreeFight(player, enemy) {
        const pair = this.getPair(player, enemy);

        if (pair.info) {
            pair.info.agree[player.playerId] = true;

            if (pair.info.agree[enemy.playerId]) this.startFight(player, enemy);
        } else this.fightPairings[pair.id] = { time: Date.now(), agree: { [player.playerId]: true } };
    }

    declineFight(player, enemy) {
        const pair = this.getPair(player, enemy);

        if (pair.info) {
            pair.info.agree[player.playerId] = false;

            // if(pair.info.agree[enemy.playerId] !== false)
        } else this.fightPairings[pair.id] = { time: Date.now(), agree: { [player.playerId]: false } };

        this.rejectFight(player, enemy);
    }

    startFight(player, enemy) {
        player.state = 'fight';
        enemy.state = 'fight';

        /* TODO: УБРАТЬ КОСТЫЛЬ!!! */
        setTimeout(() => player.setState('main') + enemy.setState('main'), 2000);

        this.api.startFight(player, enemy);

        const gameMaster = new TripleTriadGameServer(this);

        gameMaster.fight(player, enemy);
    }

    onEndFight(gameMaster) {}

    rejectFight(player, enemy) {
        player.state = 'main';
        enemy.state = 'main';
        this.api.rejectFight(player, enemy);
    }

    static init() {
        GameServer.game = new GameServer({});
        console.log('INIT');
    }
}

export default GameServer;
