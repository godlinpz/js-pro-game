import EventSourceMixin from '../engine/EventSourceMixin';
import { useApiMessageTypes } from '../engine/ApiMessageTypes';

class ServerApi {
    constructor(cfg) {
        Object.assign(this, cfg);
    }

    connect() {
        this.io.on('connection', (socket) => this.initSocket(socket));
    }

    initSocket(socket) {
        useApiMessageTypes(this, socket);

        console.log('New connection!');

        const welcomeMessage = { player_id: socket.id };
        socket.emit('welcome', welcomeMessage);
    }

    broadcast(msgType, message, room = 'game') {
        this.io.to(room).emit(msgType, message);
    }

    onJoin(socket) {
        const { game } = this;
        const playerCfg = game.getRandomSpawnPoint();
        const player = { id: socket.id, ...playerCfg };
        game.createPlayer(player);
        const response = { player, playersList: game.getPlayersList() };
        socket.join('game');
        socket.emit('join', response);
        this.broadcast('newPlayer', player);
    }

    onMove(socket, moveCfg) {
        const { game } = this;
        const id = socket.id;
        const { dx, dy } = moveCfg;
        const player = game.getPlayerById(socket.id);
        if (game.movePlayer(dx, dy, player)) socket.broadcast.emit('playerMove', { dx, dy, id });
    }

    onDisconnect(socket, reason) {
        console.log('Disconnection: ' + reason);
    }
}

Object.assign(ServerApi.prototype, EventSourceMixin);

export default ServerApi;
