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

    onMeetPlayers(socket, { id, id2 }) {
        const { game } = this.cfg;
        const player = game.getPlayerById(id);
        const player2 = game.getPlayerById(id2);
        game.onMeetPlayers(player, player2);
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
