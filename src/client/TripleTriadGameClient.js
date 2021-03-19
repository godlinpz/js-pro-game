import TripleTriadGame from '../engine/TripleTriadGame';

class TripleTriadGameClient extends TripleTriadGame {
    constructor(game) {
        super(game);
    }

    onCommonError(message) {
        this.trigger('commonError', { timeout });
    }

    onFightEnd({ message, winner }) {
        this.trigger('commonError', { message, winner });
    }

    onEvent(eventType, data) {
        this.emit(eventType, data);
    }

    chooseHand(hand, deck) {
        super.setDeck(this.player, deck);
        super.setHand(this.player, hand);

        this.api.chooseHand(hand, deck);
    }

    turn(move) {
        this.api.turn(move);
    }

    giveUp() {
        this.api.giveUp();
    }
}

export default TripleTriadGameClient;
