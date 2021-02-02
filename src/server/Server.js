// import fs from 'fs';
import path from 'path';
// import handlebars from 'handlebars';
import socketio from 'socket.io';

import Hapi from '@hapi/hapi';
import HapiInert from '@hapi/inert';
// import { setPath } from 'hookrouter';

import GameServer from './GameServer';

class Server {
    constructor(cfg) {
        this.siteServer = null;
        this.apiServer = null;
        this.gameServer = null;
        Object.assign(this, cfg);
    }

    async run() {
        console.log('Starting servers...');
        const apiServer = await this.startApi();
        this.gameServer = new GameServer({ apiServer });
        // this.startSite();
    }

    async startSite() {
        const server = (this.siteServer = Hapi.server({
            port: this.sitePort,
            host: this.host,
        }));

        await server.register(HapiInert);

        server.route({
            method: 'GET',
            path: '/{any*}',
            handler: (request, h) => {
                const localPath = path.join(process.cwd(), request.path === '/' ? 'index.html' : request.path);
                // const res = h.file(localPath);
                // h.file(path.join(process.cwd(), 'dist', 'main.js'));
                // console.log(res);
                return h.file(localPath);
            },
        });

        await server.start();
        console.log('Site Server running on %s', server.info.uri);
    }

    async startApi() {
        const apiServer = (this.apiServer = Hapi.server({
            port: this.apiPort,
            host: this.host,
        }));

        const io = socketio(apiServer.listener, {
            path: '/game',
            cors: {
                origin: `http://${this.host}:${this.sitePort}`,
                methods: ['GET', 'POST'],
                // allowedHeaders: ["my-custom-header"],
                credentials: true,
            },
        });

        io.on('connection', (socket) => {
            // either with send()

            socket.join('game');

            io.to('game').emit('hello', 'new player!');

            console.log('New connection!');

            socket.on('disconnect', (reason) => {
                console.log('Disconnection: ' + reason);
            });
        });

        await apiServer.start();
        console.log('Real Time Server running on %s', apiServer.info.uri);

        return apiServer;
    }
}

export default Server;
