import { appendFileSync } from 'fs';
import EventSourceMixin from '../engine/EventSourceMixin';
import { useApiMessageTypes } from '../engine/ApiMessageTypes';
import _ from 'lodash';

class ServerApi {
    constructor(cfg) {
        Object.assign(this, cfg);
    }

    connect() {
        this.io.on('connection', (socket) => this.initSocket(socket));
    }

    log(data) {
        appendFileSync('api_log.txt', JSON.stringify(data) + '\n\n');
    }

    initSocket(socket) {
        useApiMessageTypes(this, socket);

        console.log('New connection!');

        const welcomeMessage = { player_id: socket.id };
        this.socketEmit(socket, 'welcome', welcomeMessage);
    }

    emitTo(msgType, message, to) {
        this.log({ log: 'EMIT TO', msgType, message, to });
        this.io.to(to).emit(msgType, message);
    }

    broadcast(msgType, message, room = 'game') {
        this.log({ log: 'BROADCAST', msgType, message, room });
        this.io.to(room).emit(msgType, message);
    }

    socketEmit(sock, ...args) {
        this.log({ log: 'SOCKET EMIT', id: sock.id, ...args });
        sock.emit(...args);
    }

    socketBroadcast(sock, ...args) {
        this.log({ log: 'SOCKET BROADCAST', id: sock.id, ...args });
        sock.broadcast.emit(...args);
    }

    onJoin(socket, name) {
        const { game } = this;
        const playerCfg = game.getRandomSpawnPoint();
        const player = { id: socket.id, name, skin: game.getRandomSkin(), isNpc: false, ...playerCfg };
        game.createPlayer(player);
        const response = { player, playersList: game.getPlayersList() };
        socket.join('game');
        this.socketEmit(socket, 'join', response);
        this.broadcast('newPlayer', player);
    }

    onMove(socket, moveCfg) {
        if (!socket.isMoving) {
            const { game } = this;
            const id = socket.id;
            const [dx, dy] = game.directionToOffset(moveCfg);
            const player = game.getPlayerById(socket.id);
            const target = game.movePlayerBy(dx, dy, player);
            if (target) this.broadcast('playerMove', { id, ...target });

            socket.isMoving = true;
            setTimeout(() => (socket.isMoving = false), player.speed * 0.9);
        }
    }

    onDisconnect(socket, reason) {
        const { game } = this;
        console.log('Disconnection: ' + reason);
        game.removePlayer(socket.id);
        this.socketBroadcast(socket, 'playerDisconnect', socket.id);
    }

    onAgreeFight(socket, enemyId) {
        const { game } = this;
        const player = game.getPlayerById(socket.id);
        const enemy = game.getPlayerById(enemyId);
        game.agreeFight(player, enemy);
    }

    onDeclineFight(socket, enemyId) {
        const { game } = this;
        const player = game.getPlayerById(socket.id);
        const enemy = game.getPlayerById(enemyId);

        game.declineFight(player, enemy);
    }

    onSetDeck(socket, deck) {
        const { game } = this;
        const player = game.getPlayerById(socket.id);
        game.setDeck(player, deck);
    }

    onChooseHand(socket, { hand, deck }) {
        const { game } = this;
        const player = game.getPlayerById(socket.id);
        const gm = player && player.currentGameMaster;
        if (gm) gm.onHandChosen(player, hand, deck);
    }

    onTurn(socket, move) {
        const { game } = this;
        const player = game.getPlayerById(socket.id);
        const gm = player && player.currentGameMaster;
        if (gm) gm.onTurn(player, move);
    }

    onGiveUp(socket) {
        const { game } = this;
        const player = game.getPlayerById(socket.id);
        const gm = player && player.currentGameMaster;
        if (gm) gm.onGiveUp(player);
    }

    meetPlayers(player, player2) {
        this.broadcast('meetPlayers', {
            meet: [
                { id: player.playerId, state: player.state },
                { id: player2.playerId, state: player2.state },
            ],
        });
    }

    startFight(player, enemy) {
        this.broadcast('startFight', {
            pair: [
                { id: player.playerId, state: player.state },
                { id: enemy.playerId, state: enemy.state },
            ],
        });
    }

    rejectFight(player, enemy) {
        this.emitTo('rejectFight', { id: player.playerId, state: player.state }, enemy.playerId);
    }

    chooseYourHand(player, data) {
        this.emitTo('chooseYourHand', data, player.playerId);
    }

    fightTimeout(player, data) {
        this.emitTo('fightTimeout', data, player.playerId);
    }

    giveUp(player, data) {
        this.emitTo('giveUp', data, player.playerId);
    }

    commonError(player, data) {
        this.emitTo('commonError', data, player.playerId);
    }

    fightEnd(player, data) {
        this.emitTo('fightEnd', data, player.playerId);
    }

    nextTurn(player, data) {
        this.emitTo('nextTurn', data, player.playerId);
    }

    turnDone(player, data) {
        this.emitTo('turnDone', data, player.playerId);
    }

    initialHands(player, data) {
        this.emitTo('initialHands', data, player.playerId);
    }
}

Object.assign(ServerApi.prototype, EventSourceMixin);

export default ServerApi;
