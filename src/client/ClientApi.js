import socketio from 'socket.io-client';
import _ from 'lodash';
import EventSourceMixin from '../engine/EventSourceMixin';
import { useApiMessageTypes } from '../engine/ApiMessageTypes';

class ClientApi {
    constructor(cfg) {
        this.cfg = _.assign(cfg, cfg.apiCfg);
        this.io = null;
        this.spamTimer = null;
    }

    connect() {
        // console.log(this.cfg);
        const { port, url } = this.cfg;
        const io = (this.io = socketio(`${url}:${port}`, this.cfg));

        useApiMessageTypes(this, io);
    }

    onWelcome(socket, serverStatus) {
        console.log('Server is online', serverStatus);
    }

    onJoin(socket, player) {
        const { game } = this.cfg;
        game.createCurrentPlayer(player.player);
        game.setPlayers(player.playersList);
        console.log('JOINED A GAME!', player);
    }

    onNewPlayer(socket, player) {
        this.cfg.game.createPlayer(player);
    }

    onPlayerMove(socket, moveCfg) {
        const { game } = this.cfg;
        const { x, y, oldX, oldY, id } = moveCfg;
        const player = game.getPlayerById(id);
        const { cellX, cellY } = player.cell;

        // console.log('onPlayerMove', cellX, cellY, oldX, oldY);

        game.movePlayerTo(x, y, player);
        /*
        if( player.isInsideWindow() )
        else
        {
            const {x: newX, y: newY} = game.map.cell(x, y).worldPosition();
            player.moveTo(newX, newY, false);
        }
        */
    }

    onPlayerDisconnect(socket, id) {
        const { game } = this.cfg;
        game.removePlayer(id);
    }

    onMeetPlayers(socket, { meet: [meetPlayer1, meetPlayer2] }) {
        const { game } = this.cfg;
        const player = game.getPlayerById(meetPlayer1.id);
        const player2 = game.getPlayerById(meetPlayer2.id);
        player.setState(meetPlayer1.state);
        player2.setState(meetPlayer2.state);

        game.onMeetPlayers(player, player2);
    }

    onStartFight(socket, { pair: [pair1, pair2] }) {
        const { game } = this.cfg;

        const player = game.getPlayerById(pair1.id);
        const player2 = game.getPlayerById(pair2.id);

        player.setState(pair1.state);
        player2.setState(pair2.state);

        game.onStartFight(player, player2);
    }

    onRejectFight(socket, { id: enemyId, state }) {
        const { game } = this.cfg;
        const enemy = game.getPlayerById(enemyId);
        enemy.setState(state);

        game.onRejectFight(enemy);
    }

    onChooseYourHand(socket, { timeout }) {
        const gm = this.cfg.game.gameMaster;

        if (gm) gm.onEvent('chooseYourHand', { timeout });
    }

    onCommonError(socket, { message }) {
        const gm = this.cfg.game.gameMaster;

        if (gm) gm.onCommonError(message);
    }

    onNextTurn(socket, data) {
        const gm = this.cfg.game.gameMaster;

        if (gm) gm.onEvent('nextTurn', data);
    }

    onTurnDone(socket, data) {
        const gm = this.cfg.game.gameMaster;

        if (gm) gm.onEvent('turnDone', data);
    }

    onFightTimeout(socket, data) {
        const gm = this.cfg.game.gameMaster;

        if (gm) gm.onEvent('fightTimeout', data);
    }

    onGiveUp(socket, data) {
        const gm = this.cfg.game.gameMaster;

        if (gm) gm.onEvent('giveUp', data);
    }

    onFightEnd(socket, data) {
        const gm = this.cfg.game.gameMaster;

        if (gm) gm.onFightEnd(data);
    }

    emit(msgType, data = null) {
        if (!this.spamTimer) {
            this.spamTimer = true;
            this.io.emit(msgType, data);
            setTimeout(() => (this.spamTimer = false), 100);
        }
    }

    join() {
        this.emit('join', this.cfg.game.playerName);
    }

    movePlayer(direction) {
        this.emit('move', direction);
    }

    agreeFight(enemy) {
        this.emit('agreeFight', enemy.playerId);
    }

    declineFight(enemy) {
        this.emit('declineFight', enemy.playerId);
    }

    chooseHand(hand, deck) {
        this.emit('chooseHand', { hand, deck });
    }

    turn(move) {
        this.emit('turn', move);
    }

    giveUp() {
        this.emit('giveUp');
    }
}

Object.assign(ClientApi.prototype, EventSourceMixin);

export default ClientApi;
