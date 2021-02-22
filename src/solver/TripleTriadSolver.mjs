function randomInt(from, to) {
    return ((Math.random() * (to - from)) | 0) + from;
}

function shuffle([...arr])
{
    const len = arr.length;
    for (let i = 0; i < len; i++)
    {
        const e = arr[i];
        const n = randomInt(i, len);
        arr[i] = arr[n];
        arr[n] = e;
    }

    return arr;
}

const boardSize = 3;
// const hitSymbols = '123456789A';


class TripleTriadSolver
{
    constructor()
    {
    }

    randomHand(owner) {
        const pokes = [];
        for (let i = 0; i < 5; ++i) pokes.push(this.randomPoke(owner, i));

        return { owner, pokes, unused: [...pokes] };
    }

    randomPoke(owner, position) {
        const hits = [];
        for (let i = 0; i < 4; ++i) hits.push(randomInt(0, 10));

        return { owner, hits, rate: this.pokeRate(hits), position };
    }
/*
    solve(board, hands, currentPlayer, maxDepth = 5)
    {
        const hand1 = this.normaliseHand(player, 1);
        const hand2 = this.normaliseHand(enemy, 2);
        return this.play(this.normaliseBoard(board, [hand1, hand2]), hand1, hand2, maxDepth);
    }
*/
    solve(board, hands, currentPlayer, maxDepth = 5) {
        this.count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let empty = this.epmtyCells(board);
        
        // if(empty.length >= 7)
        //     empty = shuffle(empty);
        
        if(empty.length > 6 && maxDepth > 5 ) maxDepth = 5;
        if(empty.length === 9 && maxDepth > 4 ) maxDepth = 4;
        if(empty.length <= 6 ) maxDepth = Math.min(empty.length, maxDepth);

        const enemyId = Object.keys(hands).filter( key => key !== currentPlayer)[0];

        // console.log('TURN', board, empty, hands[currentPlayer], hands[enemyId], maxDepth);

        // return {board};

        const result = this.turn(board, empty, hands[currentPlayer].pokes, hands[enemyId].pokes, maxDepth);

        console.log('iterations', this.count);
        

        return result;
    }

    turn(board, emptyCells, playerHand, enemyHand, maxDepth = 5, depth = 0, enemyMove = false) {
        ++this.count[depth];
        let rate = 0;
        let game = [];

        // if(depth <= 1)
        //     console.log('TURN',  depth, board, emptyCells, playerHand, enemyHand, maxDepth, enemyMove);

        const hand = enemyMove ? enemyHand : playerHand;

        // console.log('DEPTH: '+depth, 'RATE: '+rate);
        // console.log(board);
        // const step = (depth >= 4 && emptyCells.length >= 6) ? 2 : 1;
        // const step = (depth > 6) ? 2 : 1;

        if (depth < maxDepth)
            for (let n = 0; n < emptyCells.length; n++) // emptyCells.forEach(([i, j]) =>
            {
                const position = emptyCells[n];

                const newEmptyCells = emptyCells.filter(pos => pos !== position);

                    // const step1 = (depth > 6) ? 2 : 1;

                for (let n1 = 0; n1 < hand.length; n1++) // emptyCells.forEach(([i, j]) =>
                {
                    const oldPoke = hand[n1];
                    const newPoke = { ...oldPoke };
                    const newHand = hand.filter((poke) => oldPoke !== poke);

                    // console.log('newHand', newHand);

                    newPoke.position = position;

                    const { board: newBoard, rate: hitRate } = this.putCard(board, newPoke);

                    let result = {rate: 0, game: []};

                    if(newEmptyCells.length && depth < maxDepth-1)
                    {
                        result = this.turn(
                            newBoard,
                            newEmptyCells,
                            enemyMove ? playerHand : newHand,
                            enemyMove ? newHand : enemyHand,
                            maxDepth,
                            depth + 1,
                            !enemyMove,
                        );
                    }

                    const { rate: deepRate, game: newGame } = result;

                    const newRate = deepRate + (enemyMove ? -hitRate : hitRate);

                    if (newRate > rate) {
                        rate = newRate;
                        game = [{ ... newPoke }].concat(newGame);
                    }
                }
            }

        return { rate, game };
    }

    putCard([...board], { ...card }) {

        const cardPos  = card.position;
        const i = cardPos/boardSize |0;
        const i3 = i*boardSize;

        const j = cardPos - i3;

        
        board[cardPos] = card;
        
        // let rate = card.rate;
        let rate = 0;
        const beaten = [];

        // обрабатываем бой покемонов:

        const hits = 
        [
            [i > 0,           0, 2, cardPos - boardSize  ],
            [j < boardSize-1, 1, 3, cardPos + 1   ],
            [i < boardSize-1, 2, 0, cardPos + boardSize  ],
            [j > 0,           3, 1, cardPos - 1   ],
        ];

        for (let [isOk, hitOwn, hitEnemy, pos] of hits) {
            if (isOk && board[pos]) {
                const cardEnemy = board[pos];

                if (cardEnemy.holder !== card.owner &&  cardEnemy.hits[hitEnemy] < card.hits[hitOwn]) {
                    rate += cardEnemy.rate;
                    const cardEnemyNew = { ...cardEnemy };
                    cardEnemyNew.holder = card.owner;
                    board[pos] = cardEnemyNew;
                    beaten.push(pos);
                }
            }
        }

        return { board, rate, beaten };
    }


    epmtyCells(board) {

        return board.reduce((empty, cell, idx) => (cell || empty.push(idx)) && empty, []);
    }

    pokeRate(hits) {
        return hits[0] + hits[1] + hits[2] + hits[3] + 1000;
    }

}

export default TripleTriadSolver;