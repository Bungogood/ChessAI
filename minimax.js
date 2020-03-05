var maxdepth = 3;

function minimax(board, depth=0, alpha=-Infinity, beta=Infinity) {
    if (depth == maxdepth || board.gameover()) {
        return  board.score();
    }

    let moves = board.generateMoves();
    let newboard;
    let best;
    let bestscore;

    if (!board.white) {
        bestscore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            newboard = board.clone();
            newboard.move(moves[i]);
            let score = minimax(newboard, depth+1, alpha, beta);
            if (score > bestscore) {
                bestscore = score;
                best = i;
            }
            if (bestscore > alpha) {alpha = bestscore}
            if (alpha >= beta) {break}
        }
    } else {
        bestscore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            newboard = board.clone();
            newboard.move(moves[i]);
            let score = minimax(newboard, depth+1, alpha, beta);
            if (score < bestscore) {
                bestscore = score;
                best = i;
            }
            if (bestscore < beta) {beta = bestscore}
            if (alpha >= beta) {break}
        }
    }
    if (depth == 0) {
        return moves[best];
    }
    return bestscore;
}