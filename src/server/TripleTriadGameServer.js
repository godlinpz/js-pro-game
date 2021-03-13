import TripleTriadGame from '../engine/TripleTriadGame';

class TripleTriadGameServer extends TripleTriadGame {
    constructor(game) {
        super(game);
        this.turnTimer = 0;
    }

    fight(players) {
        super.fight(players);

        // random first player
        const firstPlayer = (Math.random() * 2) | 0;
        this.current = this.players[firstPlayer];

        this.notifyAll('chooseYourHand', { timeout: this.maxHandBuildTime });
        this.startTimer(this.maxHandBuildTime, 'A fighter was late to choose his hand. Fight will not start.');
    }

    onHandChosen(player, hand, deck) {
        this.setPokes(player, hand);

        const opponent = this.getOpponent(player);

        if (opponent.isNpc) {
            if (!deck || !deck.length) {
                this.endFight('Player deck was not submitted. You can`t fight.');
            } else this.setPokes(opponent, this.playMachine.generateAiHand(player.deck, this.game.allPokemons));
        } else if (this.hands[player.playerId] && this.hands[opponent.playerId]) this.nextTurn();
    }

    onTurn(player, move) {
        if (player === this.current) {
            this.turn(move);
        } else this.notifyAll('commonError', { message: 'Wrong player tried to make a move!' });
    }

    nextTurn() {
        this.notifyAll('nextTurn', {
            timeout: this.maxTurnTime,
            current: this.current.playerId,
            board: this.board,
            hands: this.playMachine.normaliseHands(this.hands),
        });

        if (this.current.isNpc) this.turn();
        else this.startTimer(this.maxTurnTime, 'A fighter was late to make his move.');
    }

    turn(move = null) {
        const { hands, board } = this;

        this.lastTurn = this.playMachine.play({
            ai: this.current.isNpc,
            currentPlayer: this.current.playerId,
            hands,
            board,
            move,
        });

        this.board = lastTurn.board;

        this.notifyAll('turnDone', { player: this.current, turn: this.lastTurn });

        if (this.board.indexOf(0) >= 0) {
            this.current = this.opponent();
            this.nextTurn();
        } else {
            const hands = this.lastTurn.hands;
            const boardCounts = this.countCardHolders(this.board);
            const result = this.players.map(({ playerId: id }) => boardCounts[id] + hands[id].length);

            let message = '';
            let winner = null;

            if (result[0] === result[1]) {
                message = 'Draw game!';
            } else {
                winner = this.players[result[0] > result[1] ? 0 : 1];
                message = 'We have a winner!';
            }

            this.endFight(winner, message);
        }
    }

    countCardHolders(cards) {
        const init = {};
        this.players.forEach((p) => (init[p.playerId] = 0));
        return cards.reduce((sum, card) => card && ++sum[card.holder] && sum, init);
    }

    notifyAll(type, data) {
        this.players.forEach((p) => !p.isNpc && this.api[type](p, data));
    }

    startTimer(timeout, message, player = null) {
        this.turnTimer = setTimeout(() => this.onTimeOut(message, player), timeout);
    }

    onTimeOut(message, player = null) {
        let winner = null;
        if (player) {
            winner = this.getOpponent(player);
        } else {
        }

        this.notifyAll('fightTimeout', { message, winner: winner.playerId });

        this.endFight(winner);
    }

    onGiveUp(player) {
        this.notifyAll('giveUp', { player: player.playerId });
        this.endFight(this.getOpponent(player), 'Fight is stopped because of give up');
    }

    endFight(winner = null, message = 'End of fight') {
        this.notifyAll('fightEnd', { message, winner: winner && winner.playerId });
    }
}

export default TripleTriadGameServer;
