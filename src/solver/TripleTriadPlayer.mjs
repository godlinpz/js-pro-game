import TripleTriadSolver from './TripleTriadSolver.mjs';

const solver = new TripleTriadSolver();

class TripleTriadPlayer
{
    /*
    {
        ai: true,
        currentPlayer: 'p1',
        hands: {
            p1: [ [1,2,3,4], [1,2,3,4], [1,2,3,4], [1,2,3,4], ], 
            p2: [ [5,3,2,1], [5,3,2,1], [5,3,2,1], [5,3,2,1], [5,3,2,1], ]
        }, 
        move: {hits: [1,2,3,4], position: 5},
        board: [0, 0, 0,  0, 0, 0,  0, 0, 0], 
    }
    */

    play({ai, currentPlayer, hands, move, board})
    {
        for(let owner in hands)
            hands[owner] = this.normaliseHand(hands[owner], owner);

        board = board ? this.normaliseBoard(board) : [0, 0, 0,  0, 0, 0,  0, 0, 0];

        let result = ai 
            ? this.aiMove({currentPlayer, hands, board}) 
            : this.playerMove({currentPlayer, move, board});

        return { move, ...result }

    }
    
    aiMove({currentPlayer, hands, board})
    {
        let { rate, game } = solver.solve(board, hands, currentPlayer);

        // console.log(rate, game);

        
        return this.playerMove({currentPlayer, board, move: game.length ? game[0] : null});
    }

    playerMove({currentPlayer, move, board})
    {
        let result = {board};

        if( move.position === undefined || board[move.position] || !move.owner && !currentPlayer)  
        {
            move = null;
        }
        else
        {
            if(move.owner !== undefined) 
                currentPlayer = move.owner;
            else move.owner = currentPlayer;

            move.holder = move.owner;
            if(!move.rate) move.rate = solver.pokeRate(move.hits);
            
            result = solver.putCard(board, move);
        }

        return { move, ...result }

    }


    normaliseHand(hand, owner)
    {
        const pokes  = hand.map(poke => ({owner, holder: owner, hits: poke, rate: solver.pokeRate(poke)}));
        
        return {owner, pokes};
    }

    normaliseBoard(board)
    {
        const normBoard = board.map((poke, idx) => {
            if(poke)
            {
                if(poke.holder  === undefined ) poke.holder = poke.owner;
                if(poke.position === undefined) poke.position = idx;
                if(poke.rate === undefined)     poke.rate = solver.pokeRate(poke.hits);
            }
            
            return poke;
        });

        return normBoard;
    }

}

export default TripleTriadPlayer;