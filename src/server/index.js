import Server from './Server';

const server = new Server({ host: 'localhost', sitePort: 3000, apiPort: 3001 });

server.run();

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
