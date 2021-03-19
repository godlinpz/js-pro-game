import TripleTriadGame from '../engine/TripleTriadGame';

class TripleTriadGameClient extends TripleTriadGame {
    constructor(game) {
        super(game);
    }

    onCommonError(message) {
        console.log('TT Error', message);
        this.trigger('commonError', { message });
    }

    onFightEnd({ message, winner }) {
        this.endFight(message, winner);
    }
    onEvent(eventType, data) {
        console.log('TT Event', eventType, data);
        this.trigger(eventType, data);
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
