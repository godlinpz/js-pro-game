import TripleTriadGame from '../engine/TripleTriadGame';

class TripleTriadGameServer extends TripleTriadGame {
    constructor(game) {
        super(game);
    }

    fight(players) {
        super.fight(players);

        const firstPlayer = (Math.random() * 2) | 0;
        this.current = players[0];
    }

    setHand(player, hand) {
        super.setHand(player, hand);
        const opponent = this.getOpponent(player);

        if (opponent.isNpc) {
            if (!player.deck) console.error('No player deck found');
            else this.playMachine.generateAiHand(player.deck, this.game.allPokemons);
        }
    }

    turn(move = null) {
        const { hands, board } = this;
        this.board = this.playMachine.play({
            ai: this.current.isNpc,
            currentPlayer: this.current.playerId,
            hands,
            board,
            move,
        });
        this.current = this.opponent();
    }
}

export default TripleTriadGameServer;
