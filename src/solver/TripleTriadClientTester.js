class TripleTriadClientTester {
    constructor(game) {
        Object.assign(this, {
            game,
        });

        game.on('fight', (type, ...args) => this.onFight(...args));
    }

    onFight({ master }) {
        console.log('TESTER onFight', master);

        this.master = master;
        master.on('chooseYourHand', (type, ...args) => this.onChooseYourHand(...args));
        master.on('nextTurn', (type, ...args) => this.onNextTurn(...args));
        master.on('turnDone', (type, ...args) => this.onTurnDone(...args));
        master.on('fightTimeout', (type, ...args) => this.onFightTimeout(...args));
        master.on('giveUp', (type, ...args) => this.onGiveUp(...args));
        master.on('endFight', (type, ...args) => this.onEndFight(...args));
    }

    onChooseYourHand({ timeout }) {
        console.log('TESTER onChooseYourHand', timeout);
    }

    onNextTurn(data) {
        console.log('TESTER onNextTurn', data);
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
}

export default TripleTriadClientTester;
