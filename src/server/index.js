import netConfig from '../configs/net.json';
import Server from './Server';

const server = new Server(netConfig.servers);

server.run();

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});
