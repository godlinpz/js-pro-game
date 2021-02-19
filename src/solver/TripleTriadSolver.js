function randomInt(from, to) {
    return (Math.random() * (to - from)) | (0 + from);
}

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

    normaliseHand(hand, owner)
    {
        const pokes  = hand.map((poke, position) => ({owner, hits: poke, rate: this.pokeRate(poke), position}));
        
        return {owner, pokes, unused: []};
    }

    normaliseBoard(board, hands)
    {
        const normBoard = [];
        const used = [[],[]];
        board.forEach(row => row.forEach(cell => {
            if(cell)
            {
                const [owner, position] = cell;
                cell = hands[owner-1].pokes[position];
                used[owner-1].push(cell);
            }
            
            normBoard.push(cell);
        }));

        hands.forEach((hand, idx)=>{
            hand.unused = hand.pokes.filter(p => used[idx].indexOf(p) < 0);
        });

        return normBoard;
    }

    solve(board, player, enemy, maxDepth = 5)
    {
        const hand1 = this.normaliseHand(player, 1);
        const hand2 = this.normaliseHand(enemy, 2);
        return this.play(this.normaliseBoard(board, [hand1, hand2]), hand1, hand2, maxDepth);
    }

    play(board, player, enemy, maxDepth = 5) {
        this.count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        return this.turn(board, this.epmtyCells(board), player.unused, enemy.unused, maxDepth);
    }

    turn(board, emptyCells, playerHand, enemyHand, maxDepth = 5, depth = 0, enemyMove = false) {
        ++this.count[depth];
        let rate = 0;
        let game = [];

        const hand = enemyMove ? enemyHand : playerHand;

        // console.log('DEPTH: '+depth, 'RATE: '+rate);
        // console.log(board);

        if (depth < maxDepth)
            for (let n = 0; n < emptyCells.length; ++n) // emptyCells.forEach(([i, j]) =>
            {
                const [i, j] = emptyCells[n];

                const newEmptyCells = emptyCells.filter(([i1, j1]) => i1 !== i || j1 !== j);

                if(newEmptyCells.length)
                    hand.forEach((poke) => {
                        const newHand = hand.filter((poke1) => poke !== poke1);

                        // console.log('newHand', newHand);

                        // let rate = poke.rate + depth*100;
                        const { board: newBoard, rate: hitRate } = this.putPokeOnBoard(board, poke, i, j);

                        const { rate: deepRate, game: newGame } = this.turn(
                            newBoard,
                            newEmptyCells,
                            enemyMove ? playerHand : newHand,
                            enemyMove ? newHand : enemyHand,
                            maxDepth,
                            depth + 1,
                            !enemyMove,
                        );

                        const newRate = deepRate + (enemyMove ? -hitRate : hitRate);

                        if (newRate >= rate) {
                            rate = newRate;
                            game = [{ i, j, poke }].concat(newGame);
                        }
                    });
            }
        // );

        return { rate, game };
    }

    putPokeOnBoard([...board], { ...poke }, i, j) {
        board[i * 3 + j] = poke;
        let rate = poke.rate;

        // обрабатываем бой покемонов:

        for (let [dy, dx, hitOwn, hitEnemy] of [
            [-1, 0, 0, 2],
            [0, 1, 1, 3],
            [1, 0, 2, 0],
            [0, -1, 3, 1],
        ]) {
            const [y, x] = [i + dy, j + dx];
            const pos = y * 3 + x;
            if (x >= 0 && x < 3 && y >= 0 && y < 3 && board[pos]) {
                const { ...pokeEnemy } = board[pos];

                if (pokeEnemy.hits[hitEnemy] < poke.hits[hitOwn]) {
                    rate += pokeEnemy.rate;
                    pokeEnemy.owner = poke.owner;
                    board[pos] = pokeEnemy;
                }
            }
        }

        return { board, rate };
    }

    epmtyCells(board) {
        const empty = [];
        for (let i = 0; i < 3; ++i) for (let j = 0; j < 3; ++j) !board[i * 3 + j] && empty.push([i, j]);
        return empty;
    }

    pokeRate(hits) {
        return hits[0] + hits[1] + hits[2] + hits[3] + 1000;
    }


}

export default TripleTriadSolver;