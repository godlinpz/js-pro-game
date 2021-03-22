class TripleTriadClientTester {
    constructor(game) {
        Object.assign(this, {
            game,
            master: null,
            deck: game.allPokemons.slice(0, 10),
            hand: game.allPokemons.slice(0, 5),
        });

        game.on('fight', (type, ...args) => this.onFight(...args));
    }

    onFight({ master }) {
        console.log('TESTER onFight', master);

        this.master = master;
        master.on('chooseYourHand', (type, ...args) => this.onChooseYourHand(...args));
        master.on('initialHands', (type, ...args) => this.onInitialHands(...args));
        master.on('nextTurn', (type, ...args) => this.onNextTurn(...args));
        master.on('turnDone', (type, ...args) => this.onTurnDone(...args));
        master.on('fightTimeout', (type, ...args) => this.onFightTimeout(...args));
        master.on('giveUp', (type, ...args) => this.onGiveUp(...args));
        master.on('endFight', (type, ...args) => this.onEndFight(...args));
    }

    action(func) {
        setTimeout(func, 200);
    }

    onChooseYourHand({ timeout }) {
        console.log('TESTER onChooseYourHand', timeout);

        this.action(() => this.master.chooseHand(this.hand, this.deck));
    }

    onNextTurn(data) {
        console.log('TESTER onNextTurn', data);

        const pId = this.master.player.playerId;

        if (data.current === pId) {
            const move = data.hands[pId].pokes[0];
            move.position = data.board ? data.board.indexOf(0) : 0;
            this.action(() => this.master.turn(move));
        }
    }

    onTurnDone(data) {
        console.log('TESTER onTurnDone', data);
    }

    onFightTimeout(data) {
        console.log('TESTER onFightTimeout', data);
    }

    onGiveUp(data) {
        console.log('TESTER onGiveUp', data);
    }

    onEndFight({ message, winner }) {
        console.log('TESTER onEndFight', message, winner);
    }

    onInitialHands({ player, opponent }) {
        console.log('TESTER onInitialHands', player, opponent);
    }
}

export default TripleTriadClientTester;
