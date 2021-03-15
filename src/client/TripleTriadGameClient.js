import TripleTriadGame from '../engine/TripleTriadGame';

class TripleTriadGameClient extends TripleTriadGame {
    constructor(game) {
        super(game);
    }

    setDeck(deck) {
        super.setDeck(this.player, deck);
        this.game.api.setDeck(this.player, deck);
    }

    onCommonError(message) {
        this.trigger('commonError', { timeout });
    }

    onFightEnd({ message, winner }) {
        this.trigger('commonError', { message, winner });
    }
}

export default TripleTriadGameClient;
