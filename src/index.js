import style from './style.scss';
import Game from './game/Game';
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
