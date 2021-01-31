import socketio from 'socket.io-client';
import _ from 'lodash';
import EventSourceMixin from '../engine/EventSourceMixin';

class ServerApi {
    constructor(options = {}) {
        this.options = _.assign({ url: '', port: 3001, path: '/game' }, options || {});
        this.io = null;
    }

    connect() {
        console.log(this.options);
        const { port, url } = this.options;
        const io = (this.io = socketio(`${url}:${port}`, this.options));

        io.on('hello', this.onHello.bind(this));
    }

    onHello(msg) {
        console.log(`API: ${msg}`);
    }
}

Object.assign(ServerApi.prototype, EventSourceMixin);

export default ServerApi;
