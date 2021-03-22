import EventSourceMixin from './EventSourceMixin';

import PlayMachine from '../solver/TripleTriadPlayer.mjs';

class TripleTriadGame {
    constructor(game) {
        Object.assign(this, {
            game,
            api: game.api,
            playMachine: new PlayMachine(),
            board: null,
            maxTurnTime: 60, // seconds
            maxHandBuildTime: 120, // seconds
        });
        this.reset();
    }

    reset() {
        Object.assign(this, {
            players: [],
            hands: {},
            // pokes: [],
            lastTurn: null,
            current: null,
            board: false,
        });
    }

    fight(players) {
        this.reset();

        this.current = players[0];

        this.players = [...players];
    }

    // applies a func to every player
    each(func) {
        this.players.forEach(func);
    }

    setHand(player, hand) {
        this.hands[player.playerId] = hand;
    }

    setPokes(player, pokes) {
        this.setHand(player, this.playMachine.pokesToHandCfg(pokes));
    }

    getHand(player) {
        return this.hands[player.playerId];
    }

    setDeck(player, deck) {
        player.deck = deck;
    }

    getOpponent(player = null) {
        if (!player) player = this.current;
        return this.players[this.players[0] === player ? 1 : 0];
    }

    getPlayerById(id) {
        return this.players[this.players[0].playerId === id ? 0 : 1];
    }

    turn() {}

    endFight(message, winner) {
        this.trigger('endFight', { message, winner });
    }
}

Object.assign(TripleTriadGame.prototype, EventSourceMixin);

export default TripleTriadGame;
