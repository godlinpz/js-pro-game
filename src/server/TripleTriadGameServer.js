import _ from 'lodash';
import TripleTriadGame from '../engine/TripleTriadGame';

class TripleTriadGameServer extends TripleTriadGame {
    constructor(game) {
        super(game);
        this.turnTimer = 0;
        this.waitingFor = '';

        console.log('New TripleTriadGameServer!');

        // TODO for debug only - remove:
        this.maxTurnTime = 15; // seconds
        this.maxHandBuildTime = 15; // seconds
    }

    fight(players) {
        super.fight(players);

        this.each((p) => (p.currentGameMaster = this));

        // random first player
        const firstPlayer = (Math.random() * 2) | 0;
        this.current = this.players[firstPlayer];

        this.notifyAll('chooseYourHand', { timeout: this.maxHandBuildTime });
        this.startTimer(
            'chooseYourHand',
            this.maxHandBuildTime,
            'A fighter was late to choose his hand. Fight will not start.',
        );
    }

    onHandChosen(player, hand, deck) {
        if (this.clearTimer('chooseYourHand')) {
            this.setPokes(player, hand);
            this.setDeck(player, deck);

            const opponent = this.getOpponent(player);

            if (opponent.isNpc) {
                if (!deck || !deck.length) {
                    this.endFight(null, 'Player deck was not submitted. You can`t fight.');
                } else this.setPokes(opponent, this.playMachine.generateAiHand(deck, this.game.allPokemons));
            }
            if (this.hands[player.playerId] && this.hands[opponent.playerId]) this.beginGame();
        }
    }

    beginGame() {
        this.notifyAll('initialHands', { hands: this.hands });
        setTimeout(() => this.nextTurn(), 500);
    }

    onTurn(player, move) {
        if (this.clearTimer('turn')) {
            if (player === this.current) {
                this.turn(move);
            } else this.notifyAll('commonError', { message: 'Wrong player tried to make a move!' });
        }
    }

    nextTurn() {
        this.notifyAll('nextTurn', {
            timeout: this.maxTurnTime,
            current: this.current.playerId,
            board: this.board,
            hands: this.playMachine.normaliseHands(this.hands),
        });

        if (this.current.isNpc) this.turn();
        else this.startTimer('turn', this.maxTurnTime, 'A fighter was late to make his move.', this.current);
    }

    turn(move = null) {
        this.lastTurn = this.playMachine.play({
            ai: this.current.isNpc,
            currentPlayer: this.current.playerId,
            hands: this.hands,
            board: this.board,
            move,
        });

        _.assign(this, _.pick(this.lastTurn, 'board', 'hands'));

        this.notifyAll('turnDone', { player: this.current.playerId, turn: this.lastTurn });

        if (this.board.indexOf(0) >= 0) {
            this.current = this.getOpponent();
            this.nextTurn();
        } else {
            const hands = this.lastTurn.hands;
            const boardCounts = this.countCardHolders(this.board);
            const result = this.players.map(({ playerId: id }) => boardCounts[id] + hands[id].pokes.length);

            console.log('countCardHolders', boardCounts);
            console.log('Game result', result);

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
        this.each((p) => (init[p.playerId] = 0));
        return cards.reduce((sum, card) => {
            if (card) ++sum[card.holder];
            return sum;
        }, init);
    }

    notifyAll(type, data) {
        console.log('notifyAll', type, data);

        this.each((p) => !p.isNpc && this.api[type](p, data));
    }

    startTimer(waitingFor, timeout, message, player = null) {
        this.turnTimer = setTimeout(() => this.onTimeOut(message, player), timeout * 1000);
        this.waitingFor = waitingFor;
    }

    clearTimer(waitingFor) {
        const ok = !waitingFor || waitingFor === this.waitingFor;
        ok && clearTimeout(this.turnTimer);
        return ok;
    }

    onTimeOut(message, player = null) {
        let winner = null;
        if (player) {
            winner = this.getOpponent(player);
        } else {
        }

        this.notifyAll('fightTimeout', { message, winner: (winner && winner.playerId) || null });

        this.endFight(winner);
    }

    onGiveUp(player) {
        this.notifyAll('giveUp', { player: player.playerId });
        this.endFight(this.getOpponent(player), 'Fight is stopped because of give up');
    }

    endFight(winner = null, message = 'End of fight') {
        this.clearTimer();

        this.notifyAll('fightEnd', { message, winner: winner && winner.playerId });

        this.each((p) => (p.currentGameMaster = null));

        super.endFight(winner, message);
    }
}

export default TripleTriadGameServer;
