import ClientEngine from './ClientEngine';
import ClientMap from './ClientMap';

import playerCfg from '../configs/objects/player.json';
import terrainCfg from '../configs/objects/terrain.json';
import ClientApi from './ClientApi';

import Game from '../engine/Game';
import GameStates from '../engine/GameStates';

import $ from 'jquery';

class GameClient extends Game {
    constructor(cfg) {
        super(cfg);

        this.player = null;
        this.playerLayer = 2;
        this.playerName = '';
    }

    onCreate() {
        this.initKeys();
        const $form = $('form.username');
        $form.on('submit', (e) => {
            e.preventDefault();

            let error = false;
            const username = $form[0].username.value;
            username.length < 3 && (error = 'Minimum 3 letters');
            username.length > 12 && (error = 'Maximum 12 letters');

            error && alert(error);
            error || ((this.playerName = username) && $form.hide());
        });
    }

    createApi(cfg) {
        return new ClientApi({ game: this, ...cfg });
    }

    createEngine() {
        return new ClientEngine(document.getElementById(this.cfg.tagId));
    }

    createMap(levelCfg) {
        return new ClientMap(this, this.engine, levelCfg);
    }

    getLastRenderTime() {
        return this.engine.lastRenderTime;
    }

    initKeys() {
        this.keys = {
            ArrowLeft: () => this.movePlayerBy(-1, 0),
            ArrowRight: () => this.movePlayerBy(1, 0),
            ArrowUp: () => this.movePlayerBy(0, -1),
            ArrowDown: () => this.movePlayerBy(0, 1),
        };
        this.keysOnce = {
            // Space: (pressed) => pressed && this.pauseGame(),
        };
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

    createCurrentPlayer(playerCfg) {
        if (!this.player) {
            const playerObj = this.createPlayer(playerCfg);

            const { window } = this.map;

            window.follow(playerObj);
            this.setPlayer(playerObj);
            this.setState(GameStates.play);
        }
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
        if (this.state === GameStates.start) this.api.join();
        // this.setState(GameStates.play);
    }

    onMouseUp(e) {
        // console.log('MOUSE UP', e);
    }

    pauseGame() {
        this.engine[(this.engine.pausedAt ? 'un' : '') + 'pause']();
        this.setState(this.engine.pausedAt ? GameStates.pause : GameStates.play);
    }

    movePlayerTo(newX, newY, player = null) {
        player = player || this.player;

        if (player) {
            const [dx, dy] = [newX - player.cell.cellX, newY - player.cell.cellY];
            console.log(dx, dy);

            if ((player !== this.player || !player.speed) && super.movePlayerTo(newX, newY, player)) {
                const direction = this.offsetToDirection(dx, dy);
                const state = direction || 'main';
                player.setState(state);
                player.once('motion-stopped', () => player.setState('main', 100));

                if (player === this.player && state !== 'main') {
                    this.map.window.focus(player);
                    this.api.movePlayer(direction);
                }
            }
        }
    }

    static init(cfg) {
        GameClient.game = new GameClient(cfg);
        console.log('INIT');
    }
}

export default GameClient;
