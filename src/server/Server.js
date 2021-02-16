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
        const io = await this.startApi();
        this.gameServer = new GameServer({ io });
        // this.startSite();
    }

    async startSite() {
        const server = (this.siteServer = Hapi.server({
            port: this.site.port,
            host: this.site.host,
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
            port: this.api.port,
            host: this.api.host,
        }));

        const port = this.site.port === 80 ? '' : ':' + this.site.port;

        const io = socketio(apiServer.listener, {
            path: this.api.path,
            cors: {
                origin: `http://${this.site.host}${port}`,
                methods: ['GET', 'POST'],
                // allowedHeaders: ["my-custom-header"],
                credentials: true,
            },
        });

        await apiServer.start();
        console.log('Real Time Server running on %s', apiServer.info.uri);

        return io;
    }
}

export default Server;
