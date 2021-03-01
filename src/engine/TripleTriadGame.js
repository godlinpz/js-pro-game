import EventSourceMixin from './EventSourceMixin';

import Play from '../solver/TripleTriadPlayer.mjs';

class TripleTriadGame {
    constructor(game) {
        Object.assign(this, {
            game: game,
            play: new Play(),
        });
        this.reset();
    }

    reset() {
        Object.assign(this, {
            players: [],
            hands: [],
            lastTurn: [],
            current: null,
        });
    }

    fight(players) {
        this.reset();

        this.players[players[0].playerId] = players[0];
        this.players[players[1].playerId] = players[1];
    }

    setHand(player, hand) {
        this.hands[player.playerId] = this.play.pokesToHandCfg(hand);
    }

    getHand(player) {
        return (this.hands[player.playerId] = this.play.pokesToHandCfg(hand));
    }

    turn() {}
}

Object.assign(TripleTriadGame.prototype, EventSourceMixin);

export default TripleTriadGame;
