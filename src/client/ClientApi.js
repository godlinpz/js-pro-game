import socketio from 'socket.io-client';
import _ from 'lodash';
import EventSourceMixin from '../engine/EventSourceMixin';
import { useApiMessageTypes } from '../engine/ApiMessageTypes';

class ClientApi {
    constructor(cfg) {
        this.cfg = _.assign(cfg, cfg.apiCfg);
        this.io = null;
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
        const { x, y, id } = moveCfg;
        const player = game.getPlayerById(id);
        game.movePlayerTo(x, y, player);
    }

    onPlayerDisconnect(socket, id) {
        const { game } = this.cfg;
        game.removePlayer(id);
    }

    emit(msgType, data = null) {
        this.io.emit(msgType, data);
    }

    join() {
        this.emit('join', this.cfg.game.playerName);
    }

    movePlayer(direction) {
        this.emit('move', direction);
    }
}

Object.assign(ClientApi.prototype, EventSourceMixin);

export default ClientApi;
