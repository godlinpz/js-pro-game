import style from './style.scss';
import GameClient from './client/GameClient';
import $ from 'jquery';
import socketio from 'socket.io-client';
import netConfig from './configs/net';
import TripleTriadClientTester from './solver/TripleTriadClientTester';

$(() => {
    window.sio = socketio;

    try {
        GameClient.init({ tagId: 'game', apiCfg: netConfig.servers.api });
        window.tester = new TripleTriadClientTester(GameClient.game);
    } catch (e) {
        console.error('Exception!');
        console.error(e);
    }
});
