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

    onJoin(socket, player) {
        console.log('JOINED A GAME!', player);
    }

    onWelcome(socket, serverStatus) {
        console.log('Server is online', serverStatus);
    }
}

Object.assign(ClientApi.prototype, EventSourceMixin);

export default ClientApi;
