const hits = '123456789A';
const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];

var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const hand1 = randomHand(1),
    hand2 = randomHand(2);

// console.log(hand1);
// console.log(hand2);

console.time('play');
console.log(play(board, hand1, hand2, 4));
console.timeEnd('play');
console.log(count);

function randomInt(from, to) {
    return (Math.random() * (to - from)) | (0 + from);
}

function randomHand(owner) {
    const pokes = [];
    for (let i = 0; i < 5; ++i) pokes.push(randomPoke(owner, i));

    return { owner, pokes, unused: unusedPokes(pokes) };
}

function randomPoke(owner, position) {
    const hits = [];
    for (let i = 0; i < 4; ++i) hits.push(randomInt(0, 10));

    return { owner, hits, rate: pokeRate(hits), position };
}

function play(board, player, enemy, maxDepth = 5) {
    return turn(board, epmtyCells(board), player.unused, enemy.unused, maxDepth);
}

function turn(board, emptyCells, playerHand, enemyHand, maxDepth = 5, depth = 0, enemyMove = false) {
    ++count[depth];
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

            hand.forEach((poke) => {
                const newHand = hand.filter((poke1) => poke !== poke1);

                // console.log('newHand', newHand);

                // let rate = poke.rate + depth*100;
                const { board: newBoard, rate: hitRate } = putPokeOnBoard(board, poke, i, j);

                const { rate: deepRate, game: newGame } = turn(
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

function putPokeOnBoard([...board], { ...poke }, i, j) {
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

function epmtyCells(board) {
    const empty = [];
    for (let i = 0; i < 3; ++i) for (let j = 0; j < 3; ++j) !board[i * 3 + j] && empty.push([i, j]);
    return empty;
}

function unusedPokes(pokes) {
    const unused = [];
    for (let i = 0; i < pokes.length; ++i) !pokes[i].isUsed && unused.push(pokes[i]);
    return unused;
}

/*
function gameRate(board, owner)
{
    // Рейтинг игры - это числовая оценка выигрышности позиции для данного игрока на данном поле.

    // Рейтинг игры считаем как сумму рейтингов покемонов, принадлежащих игроку, 
    // плюс количество таких покемонов, умноженных на 100.
    // То есть в первую очередь стараемся захватить как можно больше карт, 
    // а во вторую - как можно более сильные карты

    let rate = 0;
    let count = 0;
    for(let i=0; i<board.length; ++i)
        for(let j=0; j<board.length; ++j)
        {
            const poke = board[i][j];
            if(poke && poke.owner===owner) 
            {
                ++count;
                rate += poke.rate;
            };
        }

    return rate + count*100;
}
*/
function pokeRate(hits) {
    return hits[0] + hits[1] + hits[2] + hits[3] + 1000;
}

function log(...args) {
    /*
    if(window && window.document)
    {
        const log = document.querySelector('.log');
        for(arg of args)
            log.value += 
    }
*/
    console.log(...args);
}

// 5*9* 5*8* 4*7* 4*6* 3*5* 3*4* 2*3* 2*2 * 1*1
