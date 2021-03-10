import EventSourceMixin from './EventSourceMixin';

import PlayMachine from '../solver/TripleTriadPlayer.mjs';

class TripleTriadGame {
    constructor(game) {
        Object.assign(this, {
            game,
            playMachine: new PlayMachine(),
            board: null,
            allPokemons,
        });
        this.reset();
    }

    reset() {
        Object.assign(this, {
            players: [],
            hands: [],
            lastTurn: [],
            current: null,
            board: false,
        });
    }

    fight(players) {
        this.reset();

        this.current = players[0];

        this.players[players[0].playerId] = players[0];
        this.players[players[1].playerId] = players[1];
    }

    setHand(player, hand) {
        this.hands[player.playerId] = this.play.pokesToHandCfg(hand);
    }

    getHand(player) {
        return this.hands[player.playerId];
    }

    setDeck(player, deck) {
        player.deck = deck;
    }

    getOpponent(player) {
        if (!player) player = this.current;
        return this.players[this.players[0] === player ? 1 : 0];
    }

    turn() {}
}

Object.assign(TripleTriadGame.prototype, EventSourceMixin);

export default TripleTriadGame;
