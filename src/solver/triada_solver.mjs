import TripleTriadSolver from './TripleTriadSolver.mjs';
console.time('play');

/*
    Структура поля.

    Поле состоит из трёх рядов по три ячейки.

    Одна ячейка - это массив из двух значений:
    - первое значение - это номер игрока (1 - текущий игрок или 2 - противник)
    - второе значение - это номер карты из его руки, которая лежит на данной клетке

    Рука - это список покемонов. 
    
    Покемон - это список его ударов: сверху, справа, снизу, слева
*/


const solver = new TripleTriadSolver();

const {rate, game} = solver.solve(
    // поле
    [ 
        // [[1, 1], [2, 1], [2, 0]],
        // [[1, 2], [2, 2], 0     ],
        [0,      0,      0     ],
        [0,      0,      0     ],
        [0,      0,      0     ],
    ],
    // все карты текущего игрока
    [[1,2,3,4], [5,2,3,4], [6,2,3,4], [7,2,3,4], [8,2,3,4]],
    // все карты противника
    [[4,4,4,4], [5,6,6,6], [6,8,9,9], [7,7,7,7], [1,1,1,1]],
    // глубина просчёта (может быть автоматически ограничена до 5 на больших просчётах!)
    5
);

console.log(rate, game);



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
console.log(solver.count);

console.timeEnd('play');