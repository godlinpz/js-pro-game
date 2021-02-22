// import TripleTriadSolver from './TripleTriadSolver.mjs';
import TripleTriadPlayer from './TripleTriadPlayer.mjs';
console.time('play');


// карты первого игрока
// const hand1 = [[1,2,3,4], [5,2,3,4], [6,2,3,4], [7,2,3,4], [8,2,3,4]];

// карты второго игрока 
// const hand2 = [[4,4,4,4], [5,6,6,6], [6,8,9,9], [7,7,7,7], [1,1,1,1]];

let p1 = [ [1,2,3,4], [2,2,3,4], [3,2,3,4], [4,2,3,4], ];
let p2 = [ [5,3,2,1], [5,3,2,2], [5,3,2,3], [5,3,2,4], [5,5,5,5], ];

const player = new TripleTriadPlayer();

let turn1 = player.play({
    ai: false,
    currentPlayer: 'p1',
    hands: {p1, p2}, 
    move: {hits: [1,2,3,4], position: 4},
    board: [0, 0, 0,  0, 0, 0,  0, 0, 0], 
});

// console.log(turn1);
/*
let turn2 = player.play({
    currentPlayer: 'p2',
    hands: {
        p1: [ [1,2,3,4], [1,2,3,4], [1,2,3,4], [1,2,3,4], ], 
        p2: [ [5,3,2,1], [5,3,2,1], [5,3,2,1], [5,3,2,1],  ]
    }, 
    move: {hits: [5,5,5,5], position: 5},
    board: turn1.board, 
});
*/


let turn2 = player.play({
    ai: true,
    currentPlayer: 'p2',
    hands: {p1, p2},      
    // move: {hits: [1,1,1,1], position: 5},
    board: turn1.board, 
});


console.log(turn2);


/*
    Структура поля.

    Поле состоит из трёх рядов по три ячейки.

    Одна ячейка - это массив из двух значений:
    - первое значение - это номер игрока (1 - текущий игрок или 2 - противник)
    - второе значение - это номер карты из его руки, которая лежит на данной клетке

    Рука - это список покемонов. 
    
    Покемон - это список его ударов: сверху, справа, снизу, слева
*/


/*
const solver = new TripleTriadSolver();

const board = 
// поле
[ 
    // [[1, 1], [2, 1], [2, 0]],
    // [[1, 2], [2, 2], 0     ],
    [0,         [2, 1, 2], [1, 2, 1]  ],
    [[1, 3, 1], [2, 4, 2], [2, 2, 1]  ],
    [[1, 1, 1], [1, 4, 1], [2, 3, 2]  ],
];



// все карты текущего игрока
const hand1 = [[1,2,3,4], [5,2,3,4], [6,2,3,4], [7,2,3,4], [8,2,3,4]];

// все карты противника
const hand2 = [[4,4,4,4], [5,6,6,6], [6,8,9,9], [7,7,7,7], [1,1,1,1]];

// глубина просчёта (может быть автоматически ограничена до 5 на больших просчётах!)
const deepness = 9;

let game = [1];

while(game.length)
{
    game = solver.solve(board, hand1, hand2, deepness);
    if(game.length)
    {
        console.log('GAME', game);
        const move
        board[move.]
    }
}
// console.log(rate, game);
console.log(game);

*/

/*
board: [0, 0, 0, 0, 0, { owner: 2, hits: [5,2,3,4], holder: 2, position: 5 }, 0, 0, 0]
playerMove: 3
aiMove: 5
beaten: [1,2,5]

board[5]
*/


/*
const hand1 = solver.normaliseHand([[1,2,3,4], [5,2,3,4], [6,2,3,4], [7,2,3,4], [8,2,3,4]], 1);
const hand2 = solver.normaliseHand([[4,4,4,4], [5,6,6,6], [6,8,9,9], [7,7,7,7], [1,1,1,1]], 2);

const board = solver.normaliseBoard([
    [[1, 1], [2, 1], [1, 0]],
    [0,0,0],
    [0,0,0],
], [hand1, hand2]);

console.log(hand1);
console.log(hand2);
console.log(board);
*/


/*
const board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
const hand1 = solver.randomHand(1),
    hand2 = solver.randomHand(2);



console.log(solver.play(board, hand1, hand2, 4));

console.log(JSON.stringify(hand1));
console.log(JSON.stringify(hand2));

board[1] = hand1.pokes[0];
board[3] = hand2.pokes[0];
console.log(JSON.stringify(board));
*/
// console.log(solver.count);

console.timeEnd('play');