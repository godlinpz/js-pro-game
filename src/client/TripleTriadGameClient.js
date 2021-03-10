import TripleTriadGame from '../engine/TripleTriadGame';

class TripleTriadGameClient extends TripleTriadGame {
    constructor(game) {
        super(game);
    }

    setDeck(deck) {
        super.setDeck(this.player, deck);
        this.game.api.setDeck(this.player, deck);
    }
}

export default TripleTriadGameClient;
