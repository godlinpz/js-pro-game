import EventSourceMixin from '../engine/EventSourceMixin';

import ClientEngine from './ClientEngine';
import ClientMap from './ClientMap';

import playerCfg from '../configs/objects/player.json';
import terrainCfg from '../configs/objects/terrain.json';
import ClientApi from './ClientApi';

import Game from '../engine/Game';
import GameStates from '../engine/GameStates';

import TripleTriadGame from '../client/TripleTriadGameClient';

import $ from 'jquery';

class GameClient extends Game {
    constructor(cfg) {
        super(cfg);

        Object.assign(this, {
            player: null,
            playerLayer: 2,
            playerName: '',
            gameMaster: null,
        });
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

    createMaster() {
        return new TripleTriadPlayer(this);
    }

    getLastRenderTime() {
        return this.engine.lastRenderTime;
    }

    initKeys() {
        const input = this.engine.input;
        input.onKeyState({
            ArrowLeft: () => this.movePlayerToDir('left'),
            ArrowRight: () => this.movePlayerToDir('right'),
            ArrowUp: () => this.movePlayerToDir('up'),
            ArrowDown: () => this.movePlayerToDir('down'),
        });
        input.onKey({
            // Space: (pressed) => pressed && this.pauseGame(),
        });
        input.onMouse({
            left: (pressed) => !pressed && this.state === GameStates.start && this.api.join(),
        });
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
        this.engine.input.checkKeys();

        super.onRender([time, timeGap]);

        if (this.state === GameStates.start) this.renderStartBar();
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

    pauseGame() {
        this.engine[(this.engine.pausedAt ? 'un' : '') + 'pause']();
        this.setState(this.engine.pausedAt ? GameStates.pause : GameStates.play);
    }

    onStartFight(player, player2) {
        if (this.player === player || this.player === player2) {
            const current = this.player === player ? player : player2;
            const enemy = this.player === player ? player2 : player;

            this.showInfoMessage(['', enemy.playerName, ' AGREED the fight!']);
            setTimeout(() => this.player.setState('main'), 1000);

            this.gameMaster = new TripleTriadGame(this);
            this.gameMaster.fight([current, enemy]);
            this.trigger('fight', { master: this.gameMaster });
        }
    }

    onFinishFight() {}

    onRejectFight(enemy) {
        this.player.setState('main');
        this.showInfoMessage(['', enemy.playerName, ' rejected the fight :(']);
        this.hideStartFightDialog();
        // alert(enemy.playerName + ' rejected the fight :(');
    }

    onMeetPlayers(player, player2) {
        if (this.player === player || this.player === player2) {
            const current = this.player === player ? player : player2;
            const enemy = this.player === player ? player2 : player;

            if (current.state !== 'fight') {
                let message = '';
                const enemyName = (enemy.isNpc ? '[NPC] ' : '') + enemy.playerName;

                if (enemy.state === 'fight') {
                    message = ['', enemyName, ' is already fighting!'];
                } else {
                    // message = ['You met', enemyName];
                    this.askToFight(enemy, enemyName);
                }

                if (message) this.showInfoMessage(message);
            }
        }
    }

    hideStartFightDialog() {
        const $dialog = $('.startFightDialog');
        const dialog = $dialog[0];
        if (dialog.timeout) clearTimeout(dialog.timeout);
        $dialog.hide();
        this.engine.focus();
    }

    askToFight(enemy, enemyName) {
        const $dialog = $('.startFightDialog');
        const dialog = $dialog[0];

        const decline = () => {
            this.hideStartFightDialog();
            this.api.declineFight(enemy);
        };

        $dialog.find('.no').on('click', (e) => {
            e.preventDefault();
            decline();
        });

        $dialog.find('.yes').on('click', (e) => {
            e.preventDefault();
            console.log('Starting fight...');
            this.player.setState('fight');
            this.api.agreeFight(enemy);
            this.hideStartFightDialog();
        });

        $dialog.find('span').text(enemyName);
        $dialog.show();

        if (dialog.timeout) clearTimeout(dialog.timeout);
        dialog.timeout = setTimeout(decline, 5000);
    }

    showInfoMessage([msg1, msg2, msg3]) {
        $('.meetMsg span.msg1').text(msg1);
        $('.meetMsg span.msg2').text(msg2);
        $('.meetMsg span.msg3').text(msg3);

        const $meetMsg = $('.meetMsg');
        const meetMsg = $meetMsg[0];
        $meetMsg.show();

        if (meetMsg.timeout) clearTimeout(meetMsg.timeout);
        meetMsg.timeout = setTimeout(() => $meetMsg.hide(), 3000);
    }

    movePlayerTo(newX, newY, player) {
        if (player) {
            const [dx, dy] = [newX - player.cell.cellX, newY - player.cell.cellY];
            const direction = this.offsetToDirection(dx, dy);
            // isCurrent && this.api.movePlayer(direction);

            if (super.movePlayerTo(newX, newY, player)) {
                const state = direction || 'main';
                player.setState(state);
                player.once('motion-stopped', () => player.setState('main', 100));

                this.player === player && this.map.window.focus(player);
            }
        }
    }

    movePlayerToDir(direction) {
        if (this.player.motionProgress > 0.9) this.api.movePlayer(direction);
    }

    static init(cfg) {
        GameClient.game = new GameClient(cfg);
        console.log('INIT');
    }
}

Object.assign(GameClient.prototype, EventSourceMixin);

export default GameClient;
