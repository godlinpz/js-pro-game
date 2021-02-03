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

        const welcomeMessage = { state: 'unpaused' };
        socket.emit('welcome', welcomeMessage);
    }

    broadcast(msgType, message, room = 'game') {
        this.io.to(room).emit(msgType, message);
    }

    onJoin(socket) {
        const player = { player: { x: 6, y: 6 } };
        socket.join('game');
        socket.emit('join', player);
        this.broadcast('new player', player);
    }

    onDisconnect(socket, reason) {
        console.log('Disconnection: ' + reason);
    }
}

Object.assign(ServerApi.prototype, EventSourceMixin);

export default ServerApi;
