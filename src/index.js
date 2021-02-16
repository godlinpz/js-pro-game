import style from './style.scss';
import GameClient from './client/GameClient';
import $ from 'jquery';
import socketio from 'socket.io-client';
import netConfig from './configs/net';

$(() => {
    window.sio = socketio;

    try {
        GameClient.init({ tagId: 'game', apiCfg: netConfig.servers.api });
    } catch (e) {
        console.error('Exception!');
        console.error(e);
    }
});
