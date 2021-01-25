import style from './style.scss';
import GameClient from './client/GameClient';
import $ from 'jquery';
import socketio from 'socket.io-client';

$(() => {
    window.sio = socketio;

    try {
        GameClient.init();
    } catch (e) {
        console.error('Exception!');
        console.error(e);
    }
});
