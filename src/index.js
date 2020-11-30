import style from './style.scss';
import Game from './game/Game';
import $ from 'jquery';

$(() => {
    try {
        Game.init();
    } catch (e) {
        console.log('Exception!');
        console.log(e);
    }
});
