var maxdepth = 5;
function minimax(board, depth=0, alpha=-Infinity, beta=Infinity) {
    if (depth == maxdepth || board.gameover()) {
        return  board.value;
    }
    let moves = board.generateMoves();
    let best;
    let bestscore;

    if (board.white) {
        bestscore = -Infinity;
        board.Wordermoves(moves);
        for (let i = 0; i < moves.length; i++) {
            board.move(moves[i]);
            let score = minimax(board, depth+1, alpha, beta);
            board.remove();
            if (score > bestscore) {
                bestscore = score;
                best = i;
                if (bestscore > alpha) {alpha = bestscore}
                if (alpha >= beta) {break}
            }
        }
    } else {
        bestscore = Infinity;
        board.Bordermoves(moves);
        for (let i = 0; i < moves.length; i++) {
            board.move(moves[i]);
            let score = minimax(board, depth+1, alpha, beta);
            board.remove();
            if (score < bestscore) {
                bestscore = score;
                best = i;
                if (bestscore < beta) {beta = bestscore}
                if (alpha >= beta) {break}
            }
        }
    }
    if (depth == 0) {
        return moves[best];
    }
    return bestscore;
}
