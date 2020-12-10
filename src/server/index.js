// import fs from 'fs';
import path from 'path';
// import handlebars from 'handlebars';
import socketio from 'socket.io';

import Hapi from '@hapi/hapi';
import HapiInert from '@hapi/inert';
// import { setPath } from 'hookrouter';

import levelCfg from './map.json';

const init = async () => {
    // levelCfg

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
    });

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

    const rtServer = Hapi.server({
        port: 3001,
        host: 'localhost',
    });

    const io = socketio(rtServer.listener, {
        path: '/io',
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
            // allowedHeaders: ["my-custom-header"],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        // either with send()

        socket.join('game');

        socket.send('Hello!');
        console.log('New connection!');

        socket.on('disconnect', (reason) => {
            console.log('Disconnection: ' + reason);
        });
    });

    await server.start();
    console.log('Site Server running on %s', server.info.uri);

    await rtServer.start();
    console.log('Real Time Server running on %s', rtServer.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
