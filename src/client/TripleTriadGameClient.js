import TripleTriadGame from '../engine/TripleTriadGame';

class TripleTriadGameClient extends TripleTriadGame {
    constructor(game) {
        super(game);
        this.player = game.player;
    }

    fight(players) {
        this.opponent = this.getOpponent(this.player);
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
        super.setDeck(this.game.player, deck);
        super.setHand(this.game.player, hand);

        this.api.chooseHand(hand, deck);
    }

    turn(move) {
        this.api.turn(move);
    }

    giveUp() {
        this.api.giveUp();
    }

    onInitialHands(hands) {
        this.trigger('initialHands', { player: hands[this.player.playerId], opponent: hands[this.opponent.playerId] });
    }
}

export default TripleTriadGameClient;
