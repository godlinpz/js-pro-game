import style from './style.scss';
import Game from './client/GameClient';
import $ from 'jquery';
import socketio from 'socket.io-client';

$(() => {
    window.sio = socketio;

    try {
        Game.init();
    } catch (e) {
        console.log('Exception!');
        console.log(e);
    }
});
