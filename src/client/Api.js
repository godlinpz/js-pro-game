import socketio from 'socket.io-client';
import _ from 'lodash';
import EventSource from '../engine/EventSource';

class Api extends EventSource {
    constructor(options = {}) {
        super();
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

export default Api;
